npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite

npx prisma migrate dev --name init

npx prisma generate

"scripts": {
"generate": "prisma generate",
"migrate": "prisma migrate dev",
"dev": "npm run generate && nest start --watch"
}
