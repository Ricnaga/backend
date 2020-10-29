const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

const projects = []

function logRequests(req, res, next){
    const {method, url} = req;

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.log(logLabel)
    return next();
}

function validateProjectId(req, res, next){
    const {id} = req.params

    if(!isUuid(id)){
        return res.status(400).json({error: "Invalid project ID"})
    }
    return next();
}

app
.use(express.json(projects))
.use(cors())
.use(logRequests)
.use('/projects/:id', validateProjectId)

/*Método Http
GET:buscar informaçõesdo backend
POST: criar informação no backend
PUT/PATCH: Alterar informação no backend, PUT atualiza todas as informações, patch atualiza uma informação específica
DELTE: apagar informação no backend
*/

.get('/projects', (req, res) => {

    const {title} = req.params;
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

    return res.json(results)
})

.post('/projects', (req, res) => {
    const {title, owner} = req.body;

    const project = {id:uuid(), title, owner};
    projects.push(project)

    return res.json(project)
})

.put('/projects/:id', (req, res) => {
    const {id} = req.params;
    const {title, owner} = req.body;

    console.log(id)

    const projectIndex = projects.findIndex(project => project.id === id)

    if(projectIndex < 0){
        return res.status(400).json({error: "Page not found"})
    }

    const project = {
        id,
        title,
        owner,
    }

    projects[projectIndex] = project

    return res.json(project)
})

.delete('/projects/:id', (req, res) => {
    const {id} = req.params;

    const projectIndex = projects.findIndex(project => project.id === id)

    if(projectIndex < 0){
        return res.status(400).json({error: "Page not found"})
    }

    projects.splice(projectIndex, 1)

    return res.status(204).send()
})

.listen(3333, () =>{
    console.log("Application is being watched!👀")
})