from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests

app = FastAPI()

r = requests.get('https://eun1.api.riotgames.com/lol/match/v4/matches/2688632321?api_key=RGAPI-492fac5d-ee87-45bc-8b3c-deeba004a33d')

# print(r.json())


app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")
templates = Jinja2Templates(directory="../frontend/build")


# origins = [
#     "http://localhost:3000",
#     "localhost:3000"
# ]


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

@app.get("/")
async def show_public_statics(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/todo", tags=["todos"])
async def get_todos() -> dict:
    return { "data": "dd" }