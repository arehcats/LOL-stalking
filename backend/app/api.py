from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests
from config import APP_RITO_API_KEY

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:3000/eune/arehcats",
    "localhost:3000/eune/arehcats",
    "http://localhost",
    "localhost",
    "http://localhost:8080"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=['*'],
    allow_methods=["*"],
    allow_headers=["*"]
)


app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")
templates = Jinja2Templates(directory="../frontend/build")




@app.get("/", tags=["Statics"])
@app.get("/login", tags=["Statics"])
@app.get("/eune/{username}", tags=["Statics"])
async def show_statics(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/summoner", tags=["riot_api"])
async def get_summoner(region, SummonerName) :
    
    return requests.get("https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + SummonerName + "?api_key=" + APP_RITO_API_KEY).json()

@app.get("/api/summonerID", tags=["riot_api"])
async def summonerRank(region, SummonerID) :
    print("https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + SummonerID + "?api_key=" + APP_RITO_API_KEY)
    return requests.get("https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + SummonerID + "?api_key=" + APP_RITO_API_KEY).json()

