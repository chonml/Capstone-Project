from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf
from pyspark.sql.types import BooleanType
from geopy.distance import geodesic
import sys, json


def main():
    if len(sys.argv) != 4:
        print("Usage: crime_radius.py <lat> <lon> <csv_path>")
        sys.exit(1)

    target_lat = float(sys.argv[1])
    target_lon = float(sys.argv[2])
    csv_path = sys.argv[3]

    spark = SparkSession.builder.appName("CrimeRadiusGeopy").getOrCreate()

    # Load data
    df = spark.read.option("header", "true").option("inferSchema", "true").csv(csv_path)
    df = df.withColumn("LAT", col("LAT").cast("double")) \
           .withColumn("LON", col("LON").cast("double"))

    # bounding box (5 mile buffer)
    lat_buffer = 0.1
    lon_buffer = 0.1

    df_box = df.filter(
        (col("LAT").isNotNull()) & (col("LON").isNotNull()) &
        (col("LAT") >= target_lat - lat_buffer) & (col("LAT") <= target_lat + lat_buffer) &
        (col("LON") >= target_lon - lon_buffer) & (col("LON") <= target_lon + lon_buffer)
    )

    def is_within_5(lat, lon):
        try:
            return geodesic((lat, lon), (target_lat, target_lon)).miles <= 5
        except:
            return False

    within_udf = udf(is_within_5, BooleanType())

    # Apply UDF and select top results
    result_df = df_box.withColumn("within", within_udf(col("LAT"), col("LON"))) \
        .filter(col("within") == True) \
        .select(
            col("LAT").alias("LAT"),
            col("LON").alias("LON"),
            col("Crm Cd Desc").alias("CRM_CD_DESC")
        ) \
        .limit(100)

    print(json.dumps(result_df.toJSON().map(lambda x: json.loads(x)).collect()))
    spark.stop()

if __name__ == "__main__":
    main()
