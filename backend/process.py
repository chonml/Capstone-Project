from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import StringType
from geopy.geocoders import Nominatim


def create_session(data_path):
    """
    Function to create spark session and dataframe
    """
    spark = SparkSession.builder.appName("crime_data").getOrCreate()

    df = spark.read.option("header", "true").csv(data_path)

    return df

def create_geo_embedding(df):
    """
    Function to convert addresses to long and lat coordinates for mapping
    """
    geolocator = Nominatim(user_agent="create_location")

    def geocode_address(location):
        if location:
            loc = geolocator.geocode(location)
            if loc:
                return f"{loc.latitude},{loc.longitude}"
        return None

    geocode_udf = F.udf(geocode_address, StringType())
    df = df.withColumn("coordinates", geocode_udf(F.col("LOCATION")))


def clean_and_impute(df, column_name):
    """
    Function to clean and impute missing values in a specified column.
    It replaces:
    - "-" with NULL
    - "NULL" string with actual NULL
    - Keeps "H" as is
    - Imputes remaining NULLs with class distribution based on the column.
    """
    
    df_cleaned = df.withColumn(
        column_name,
        F.when(F.col(column_name) == "-", None)  # Replace "-" with NULL
        .when(F.col(column_name) == "NULL", None)  # Replace "NULL" string with NULL
        .otherwise(F.col(column_name))  # Keep other values as they are, including "H"
    )
    
    class_proportions = df_cleaned.groupBy(column_name).count().withColumn(
        "proportion", F.col("count") / df_cleaned.count()
    )
    
    male_proportion = class_proportions.filter(F.col(column_name) == "M").first()["proportion"]
    female_proportion = class_proportions.filter(F.col(column_name) == "F").first()["proportion"]
    other_proportion = class_proportions.filter(F.col(column_name) == "X").first()["proportion"]
    
    df_imputed = df_cleaned.withColumn(
        column_name,
        F.when(
            F.col(column_name).isNull(),
            F.when(F.rand() < male_proportion, "M")
            .when(F.rand() < male_proportion + female_proportion, "F")
            .otherwise("X")
        ).otherwise(F.col(column_name))  # Keep existing non-NULL values, including "H"
    )
    
    return df_imputed

def show_columns(df):
    """
    Function to list all columns and their datatypes
    """
    columns_and_types = df.dtypes

    for column, dtype in columns_and_types:
        print(f"Column: {column}, Type: {dtype}")


if __name__ == "__main__":
    df = create_session("data/Crime_Data_from_2020_to_Present.csv")

    print(df.filter(F.col("LOCATION").isNull()).count())

    df_imputed = clean_and_impute(df, "Vict Sex")

    # df_imputed.select("Vict Sex").show(truncate=False)
    # null_count = df_imputed.filter(df_imputed["Vict Sex"].isNull()).count()
    # print(f"Number of NULL values in 'Vict Sex': {null_count}")

    show_columns(df_imputed)
    print("\n")
    create_geo_embedding(df_imputed)


    df_imputed.coalesce(1) \
        .write \
        .option("header", "true") \
        .csv("data/processed_df.csv")







