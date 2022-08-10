
const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/wizard_news_seq_2208_db')
const express = require('express')
const app = express()

const User = conn.define('user', {
    name: {
        type: Sequelize.STRING
    }
})
const Post = conn.define('post', {
    title: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    }
})

Post.belongsTo(User)
// User.hasMany(Post) -- same as above

app.use('/assets', express.static('assets'))
app.use(express.urlencoded({ extended: false }))

app.post('/posts', async (req, res, next) => {
    try {
        const post = await Post.create(req.body)
        res.redirect(`/posts/${post.id}`)
    } catch (ex) {
        next(ex)
    }
})

app.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: [User]
        })
        const users = await User.findAll()
        res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='/assets/style.css' />
            </head>
            <body>
                <h1>Wizard News Seq</h1>
                <main>
                <ul>
                    ${posts.map(post => {
            return `
                    <li>
                        <a href='/posts/${post.id}'>${post.title} by ${post.user.name}</a>
                    </li>
                    `
        }).join('')
            }
                </ul>
                <form method='post' action='/posts'>
                    <input name='title' placeholder='title' />
                    <input name='content' placeholder='content' />
                    <select name='userId'>
                        ${users.map(user => {
                return `
                                    <option value=' ${user.id}'>${user.name}</option>
                                
            `}).join('')
            }
                    </select>
                    <button>Create</button>
                </form>
                </main
            </body>
            
        </html>
        `)
    } catch (ex) {
        next(ex)
    }
})

app.get('/posts/:id', async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [User]
        })

        res.send(`
        <html>
            <head>
            <body>
                <h1>Wizard News Seq</h1>
                <h2> ${post.title} by ${post.user.name} </h2>
                <p>${post.content}</p>
            </body>
            </head>
        </html>
        `)
    } catch (ex) {
        next(ex)
    }
})

const start = async () => {
    try {
        console.log('starting')
        await conn.sync({ force: true })
        const moe = await User.create({ name: 'moe' })
        const lucy = await User.create({ name: 'lucy' })
        const larry = await User.create({ name: 'larry' })
        const ethyl = await User.create({ name: 'ethyl' })
        await Post.create({ title: 'foo', content: 'this is the foo content', userId: moe.id })
        await Post.create({ title: 'bar', content: 'this is the bar content', userId: moe.id })
        await Post.create({ title: 'bazz', content: 'this is the bazz content', userId: lucy.id })

        const port = process.env.PORT || 3000
        app.listen(port, () => console.log(`you on that shiii: ${port}`))
    } catch (err) {
        console.log(err)
    }
}

start()