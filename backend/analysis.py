from pyspark.sql import SparkSession
from pyspark.sql import functions as F

def create_session(data_path):
    spark = SparkSession.builder.appName("crime_analysis").getOrCreate()
    
    df = spark.read.option("header", "true").csv(data_path)

    return df, spark


if __name__ == "__main__":
    df, spark = create_session("data/processed_df.csv")
    df.createOrReplaceTempView("crime_data")

    # 1. Count the number of unique crimes
    query = """
    SELECT COUNT(DISTINCT DR_NO) AS total_unique_crimes
    FROM crime_data
    """

    total_unique_crimes = spark.sql(query)
    total_unique_crimes.show()

    # 2. Distinct Crime By AREA
    query = """
    SELECT AREA, COUNT(DISTINCT DR_NO) AS crime_count
    FROM crime_data
    GROUP BY AREA
    ORDER BY crime_count DESC
    """

    crime_by_area = spark.sql(query)
    crime_by_area.show()

    # 3. Crime By Sex
    query = """
    SELECT `Vict Sex`, COUNT(DISTINCT DR_NO) AS crime_count
    FROM crime_data
    GROUP BY `Vict Sex`
    ORDER BY crime_count DESC
    """

    crime_by_sex = spark.sql(query)
    crime_by_sex.show()

    # 4. Count Crimes By Victim's Age
    query = """
    SELECT `Vict Age`, COUNT(DISTINCT DR_NO) AS crime_count
    FROM crime_data
    GROUP BY `Vict Age`
    ORDER BY crime_count DESC
    """

    # Execute the query
    crime_by_age = spark.sql(query)
    crime_by_age.show()

    # 5. Count Crimes by Weapon Used
    query = """
    SELECT `Weapon Used Cd`, COUNT(DISTINCT DR_NO) AS crime_count
    FROM crime_data
    WHERE `Weapon Used Cd` IS NOT NULL
    GROUP BY `Weapon Used Cd`
    ORDER BY crime_count DESC
    """

    # Execute the query
    crime_by_weapon = spark.sql(query)
    crime_by_weapon.show()