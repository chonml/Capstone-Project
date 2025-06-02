import subprocess
import time
import csv
import os
import matplotlib.pyplot as plt
import pandas as pd
from pyspark.sql import SparkSession

lat = "34.0478361"
lon = "-118.2565221"
full_csv = "part-00000-be8fe0f4-281e-4016-b734-0e1ba5243a81-c000.csv"
script = "crime_radius.py"

subset_files = {
    "1k": "subset_1k.csv",
    "50k": "subset_50k.csv",
    "100k": "subset_100k.csv"
}
row_counts = {
    "1k": 1000,
    "50k": 50000,
    "100k": 100000
}
worker_counts = [1, 2, 4, 8, 12]

def generate_subsets():
    spark = SparkSession.builder.appName("SubsetBuilder").getOrCreate()
    df = spark.read.option("header", "true").option("inferSchema", "true").csv(full_csv)

    for label, count in row_counts.items():
        path = subset_files[label]
        print(f"Writing {label} subset to {path}...")
        df.limit(count).write.csv(path, header=True, mode="overwrite")
    spark.stop()

def benchmark():
    results = []
    for label, csv_dir in subset_files.items():
        csv_path = os.path.join(csv_dir)
        for workers in worker_counts:
            print(f"{label} rows | {workers} workers...")
            start = time.perf_counter()
            try:
                subprocess.run(
                    ["spark-submit", f"--master=local[{workers}]", script, lat, lon, csv_path],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=True
                )
                end = time.perf_counter()
                duration = round(end - start, 2)
                results.append((label, workers, duration))
                print(f"{workers} workers: {duration} seconds")
            except subprocess.CalledProcessError:
                results.append((label, workers, None))
                print(f"{workers} workers FAILED")

    with open("multi_dataset_benchmark.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["dataset_size", "workers", "duration_seconds"])
        writer.writerows(results)
    return results

def plot_results(results):
    df = pd.DataFrame(results, columns=["dataset_size", "workers", "duration_seconds"])
    pivot = df.pivot(index="workers", columns="dataset_size", values="duration_seconds")

    pivot.plot(marker='o', title="Spark Runtime by Worker Count & Dataset Size")
    plt.xlabel("Number of Workers")
    plt.ylabel("Execution Time (seconds)")
    plt.grid(True)
    plt.savefig("multi_benchmark_plot.png")
    plt.show()


if __name__ == "__main__":
    generate_subsets()
    results = benchmark()
    plot_results(results)
