from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests
from config import APP_RITO_API_KEY

app = FastAPI()


# print(r.json())

print(APP_RITO_API_KEY)


app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")
templates = Jinja2Templates(directory="../frontend/build")




@app.get("/", tags=["Statics"])
@app.get("/login", tags=["Statics"])
@app.get("/eune/{username}", tags=["Statics"])
async def show_statics(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/summoner", tags=["riot_api"])
async def get_todos(region, SummonerName) :
    return requests.get("https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + SummonerName + "?api_key=" + APP_RITO_API_KEY).json()


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