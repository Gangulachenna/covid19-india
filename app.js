const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "covid19India.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(30000, () => {
      console.log("Server Running at http://localhost:30000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertStateObjectIntoResponse = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

const convertDistrictObjectIntoResponse = (dbObject) => {
  return {
    districtId: district_id,
    districtName: district_name,
    stateId: state_id,
    cases: dbObject.cases,
    cured: dbObject.cured,
    active: dbObject.active,
    deaths: dbObject.deaths,
  };
};

app.get("/states/", async (request, response) => {
    const getQuery = `SELECT * FROM state ORDER BY state_id;`;

    const stateArray = await db.all(getQuery);

     response.send(
         stateArray.map(eachState() => convertStateObjectIntoResponse(eachState))
     )
}); 



app.get("/states/:stateId/", async(request,response) => {
  const   {stateId} = request.params;
  const getStateIdQuery = `SELECT * FROM state WHERE state_id = ${stateId};`;

  const stateId = await db.get(getStateIdQuery);

  response.send(convertStateObjectIntoResponse(eachState));
});

app.post("/districts/", async (request,response) => {

    const {districtName,stateId,cases,cured,active,deaths} = request.body;

    const  postQuery = `INSERT INTO (district_name,state_id,cases,curved,active,deaths) VALUES ('${districtName}',${stateId},${cases},${curved},${active},${deaths});`;

    const postArray = await db.run(postQuery);

    response.send("District Successfully Added");
})


app.get("/districts/:districtId/", async (request,response) => {
    const {districtId} = request.params;

    const getDistrictId = `SELECT * FROM district WHERE district_id = ${districtId};`;

    const getDistrictArray =  await db.get(getDistrictArray);

    response.send(convertDistrictObjectIntoResponse(eachState));
});


app.delete("/districts/:districtId/", async(request,response) => {
    const {district_id} = request.params;

    const deleteQuery = `DELETE FROM district WHERE district_id = ${districtId};`;

    await db.run(deleteQuery);
    response.send("District Removed");
});



app.put("/districts/:districtId/", async(request,response) =>{

    const {districtId}  = request.params;

    const {districtName,stateId,cases,cured,active,deaths} = request.body;

    const updateQuery = ` UPDATE district SET district_name = '${districtName}',
    state_id = ${stateId},cases = ${cases},cured = ${cured},active =${active},deaths = ${deaths} WHERE district_id = ${districtId};`;
    
    await db.run(updateQuery);
    response.send("District Details Updated");

});


app.get("/states/:stateId/stats/", async(request.response) =>{
    const {stateId} = request.params;

    const getDistrictQuery = `SELECT SUM(cases) AS totalCases,SUM(cured) AS totalCured, SUM(active) AS totalActive,SUM(deaths) AS totalDeaths FROM district WHERE state_id = ${stateId};`;
    const stateArrays = await db.get(getDistrictQuery);

    response.send(stateArrays);
    
})

app.get("/districts/:districtId/details/", async(request.response) => {
    const {districtId} = request.params;

    const districtStateQuery = `SELECT state_id FROM district WHERE district_id = ${districtId};`;

    const resultDistrictStateQuery = await db.get(districtStateQuery);

    const stateQueryName = `SELECT state_name AS stateName * FROM state WHERE state_id = ${resultDistrictStateQuery.state_id};`;

    const resultNameQueryResponse = await db.get(stateQueryName);

    response.send(resultNameQueryResponse);

    
})



module.exports = app;


