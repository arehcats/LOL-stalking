from fastapi import Depends, FastAPI, Request, Response, HTTPException
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
@app.get("/favicon.ico", tags=["Statics"])
# @app.get("/manifest.json", tags=["Statics"])
async def show_statics(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# @app.get("/manifest.json", tags=["Statics"])
# async def manifes(request: Request):
#     return templates.TemplateResponse("manifest.json", {"request": request}, media_type='application/json')


# @app.get("/assets/delete_plus/{img}", tags=["Statics"])
# async def show_delete_plus(request: Request, img):
#     return templates.TemplateResponse("assets/delete_plus/" + img, {"request": request}, media_type='image/svg+xml')

# @app.get("/assets/rank-icons/{img}", tags=["Statics"])
# async def show_ranks(request: Request, img):
#     print("woooooooooooooork")
#     return templates.TemplateResponse("assets/rank-icons/" + img, {"request": request}, media_type='image/png')

@app.get("/api/summoner", tags=["riot_api"])
async def get_summoner(region, SummonerName) :
    response = requests.get("https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + SummonerName + "?api_key=" + APP_RITO_API_KEY)
    responseJSON = response.json()    
    print("dd")
    if response.status_code != 200:
        raise HTTPException(status_code=responseJSON["status"]["status_code"], detail=responseJSON["status"]["message"])
    return responseJSON

@app.get("/api/summonerID", tags=["riot_api"])
async def summonerRank(region, SummonerID) :
    response = requests.get("https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + SummonerID + "?api_key=" + APP_RITO_API_KEY)
    responseJSON = response.json()    
    if response.status_code != 200:
        raise HTTPException(status_code=responseJSON["status"]["status_code"], detail=responseJSON["status"]["message"])
    return responseJSON

@app.get("/api/last100games", tags=["riot_api"])
async def last100games(region, accountId) :
    response = requests.get("https://" + region + ".api.riotgames.com/lol/match/v4/matchlists/by-account/" + accountId + "?api_key=" + APP_RITO_API_KEY)
    responseJSON = response.json()    
    if response.status_code != 200:
        raise HTTPException(status_code=responseJSON["status"]["status_code"], detail=responseJSON["status"]["message"])
    return responseJSON

@app.get("/api/matchlists", tags=["riot_api"])
async def matchlists(region, accountId, gameID, endIndex, beginIndex) :
    response = requests.get("https://" + region + ".api.riotgames.com/lol/match/v4/matchlists/by-account/" + accountId + "?queue=" + gameID + "&beginTime=1610085600000&endIndex=" + endIndex + "&beginIndex=" + beginIndex + "&api_key=" + APP_RITO_API_KEY)
    responseJSON = response.json()    
    if response.status_code != 200:
        raise HTTPException(status_code=responseJSON["status"]["status_code"], detail=responseJSON["status"]["message"])
    return responseJSON

@app.get("/api/match", tags=["riot_api"])
async def match(region, matchID) :
    response = requests.get("https://" + region + ".api.riotgames.com/lol/match/v4/matches/" + matchID + "?api_key=" + APP_RITO_API_KEY)
    responseJSON = response.json()    
    if response.status_code != 200:
        raise HTTPException(status_code=responseJSON["status"]["status_code"], detail=responseJSON["status"]["message"])
    return responseJSON