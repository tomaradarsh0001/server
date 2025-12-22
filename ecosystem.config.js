module.exports = { 
  apps: [
{
name: "nextapp",
script: "npm",
args: "start",
env: {
   PORT: 4000,
   NODE_ENV: "production"
}
}
]
}
