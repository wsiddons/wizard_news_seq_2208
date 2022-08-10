
const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/wizard_news_seq_2208_db')

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
    } catch (err) {
        console.log(err)
    }
}

start()