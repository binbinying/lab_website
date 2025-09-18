# rag/rag_server.py

from flask import Flask, request, jsonify
from langchain_ollama import OllamaEmbeddings
# from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import Ollama
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.chains import RetrievalQA
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Load and embed documents once at startup
def load_vectorstore():
    print("🔄 Loading PDF documents...")
    docs = []
    for file in os.listdir("rag/documents"):
        if file.endswith(".pdf"):
            loader = PyPDFLoader(f"rag/documents/{file}")
            docs.extend(loader.load())

    print("✂️ Splitting documents...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    print("🧠 Creating vector store...")
    embeddings = OllamaEmbeddings(model="mistral")
    vectorstore = FAISS.from_documents(chunks, embeddings)

    return vectorstore

# Initialize model and RAG pipeline
print("🚀 Starting RAG server...")
vectorstore = load_vectorstore()
retriever = vectorstore.as_retriever()
llm = Ollama(model="mistral")
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

@app.route("/api/rag", methods=["POST"])
def rag_chat():
    data = request.json
    question = data.get("question", "")
    print(f"📩 User question: {question}")
    if not question:
        return jsonify({"error": "Missing question"}), 400

    response = qa_chain.run(question)
    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(port=5000)