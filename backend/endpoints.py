from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import Together
import os
import json
from pyspark.sql import SparkSession
from pyspark.sql.functions import count

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

spark = SparkSession.builder \
    .appName("FlaskCrimeQuery") \
    .config("spark.jars", "lib/postgresql-42.7.3.jar") \
    .getOrCreate()

# Connect to PostgreSQL via JDBC
jdbc_url = f"jdbc:postgresql://{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
props = {
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "driver": "org.postgresql.Driver"
}

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")

llm = Together(
    model="mistralai/Mistral-7B-Instruct-v0.1",
    temperature=0.7,
    max_tokens=512,
    together_api_key=TOGETHER_API_KEY
)

@app.route("/nearby_crimes", methods=["POST"])
def nearby_crimes():
    data = request.get_json()
    lat = data.get("lat")
    lon = data.get("lon")

    if lat is None or lon is None:
        return jsonify({"error": "Missing coordinates"}), 400

    try:
        radius_m = 1609.34  # 1 mile

        # SQL query with ST_DWithin pushed down
        postgis_query = f"""
            (SELECT "LAT", "LON", "Crm Cd Desc" AS description
             FROM crimes_data
             WHERE geom IS NOT NULL
               AND ST_DWithin(
                   geom,
                   ST_SetSRID(ST_MakePoint({lon}, {lat}), 4326)::geography,
                   {radius_m}
               )
             LIMIT 75) AS nearby_crimes
        """

        df = spark.read.jdbc(url=jdbc_url, table=postgis_query, properties=props)

        result = df.toJSON().map(lambda x: json.loads(x)).collect()

        return jsonify({"crimes": result})

    except Exception as e:
        print("PostGIS query failed:", e)
        return jsonify({"error": "PostGIS query failed", "details": str(e)}), 500

@app.route("/summarize_area", methods=["POST"])
def summarize_area():
    data = request.get_json()
    address = data.get('address')
    crimes = data.get('crimes', [])

    if not address:
        return jsonify({"summary": "No address provided."}), 400

    if not crimes:
        return jsonify({"summary": "No crime data provided."}), 400

    crime_text = "\n".join(
        f"- {c['description']} on {c['date']}" for c in crimes if 'description' in c and 'date' in c
    )

    prompt_template = PromptTemplate(
        input_variables=["address", "crime_text"],
        template="""
            You are a professional neighborhood analyst.

            Analyze the following address: {address}

            Here are recent crimes reported within a 1-mile radius:
            {crime_text}

            Based on this data, write a professional neighborhood summary. Focus on:
            - Types of crimes (e.g., burglaries, thefts, assaults)
            - Crime frequency or patterns
            - Overall safety level (scale 1–10)

            Consider the dates of the crimes as well and make a decision on whether or not someone should be there at the time of the query.
            Make it clear, concise, and professional.
            """
    )

    crime_summary_chain = LLMChain(llm=llm, prompt=prompt_template)
    summary = crime_summary_chain.run({
        "address": address,
        "crime_text": crime_text
    })

    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(port=8000, debug=True)