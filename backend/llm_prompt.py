from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import Together
from transformers import pipeline
import os

app = Flask(__name__)
CORS(app)

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")

llm = Together(
    model="mistralai/Mistral-7B-Instruct-v0.1",
    temperature=0.7,
    max_tokens=512,
    together_api_key=TOGETHER_API_KEY
)

@app.route("/summarize_area", methods=["POST"])
def summarize_area():
    data = request.get_json()
    address = data.get('address')

    if not address:
        return jsonify({"summary": "No address provided."}), 400


    prompt_template = PromptTemplate(
        input_variables=["address"],
        template="""
                Tell me about this area. Use current information about the address on the internet to make insightful responses about neighborhood culture and crime presence.
                 Use the information gathered from the internet to create a professional neighborhood summary that incorporates the following elements:

                - Types of crimes: Discuss the types of crimes that occur in the area. For example, are there more burglaries, robberies, or assaults?

                - Crime frequency: Describe how often crimes occur in the area. This can be based on recent police reports or other sources of information.

                - Overall safety level: Based on the types and frequency of crimes, provide an overall safety rating for the area. This could be on a scale of 1-10, with 10 being the safest.
                Write a short professional neighborhood summary focusing on the types of crimes, their frequency, and the overall safety level.
                """
    )

    crime_summary_chain = LLMChain(llm=llm, prompt=prompt_template)
    
    summary = crime_summary_chain.run({
        "address": address
    })

    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(port=8000, debug=True)