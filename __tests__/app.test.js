const request = require('supertest')
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const endpoints = require('../endpoints.json');
const articles = require('../db/data/test-data/articles');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    if (db.end) db.end();
});

describe("GET api/topics", () => {
    test("with a status 200, it should return all the topics" , () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body}) => {
        expect(body.topics).toBeInstanceOf(Array)
        expect(body.topics.length).toBe(3)
        body.topics.forEach((topic) => {
            expect(topic).toHaveProperty(
                'description', expect.any(String),
                'slug', expect.any(String)
            )
            })
        })
    })
    test ("200: accepts a sort_by query which sorts by slug (ascending order by default)", () => {
    return request(app)
    .get("/api/topics?sort_by=slug")
    .expect(200)
    .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics).toHaveLength(3);
        expect(body.topics).toBeSortedBy("slug");
        })
    })
    test("400: responds with bad request for an invalid sort_by", () =>{
    return request(app)
    .get('/api/topics?sort_by=kiwi')
    .expect(400)
    .then(({ body }) => {
        expect (body.msg).toBe("Bad request");
        })
    })
});
describe("/api test suite", () => {
    test("200: should respond a description of all other endpoints available", () => {
    return request(app)
    .get('/api')
    .expect(200)  
    .then(({body}) => {
        expect(body.endpoints).toEqual(endpoints);
            })
        })
});
describe('GET /api/articles/:article_id', () => {
    test('200: should respond with all articles that match the given article_id', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({ body })=>{
            body.articles.forEach((article)=> {
                expect(typeof article).toBe("object"),
                expect(article.article_id).toBe(3),
                expect(article).toHaveProperty(
                    'article_id', expect.any(Number),
                    'title', expect.any(String),
                    'topic', expect.any(String),
                    'author', expect.any(String),
                    'body', expect.any(String),
                    'created_at', expect.any(Number),
                    'votes', expect.any(Number),
                    'article_img_url', expect.any(String)
                    )
            })
        })
    })
    test("status: 404 responds with an error when given an article_id that doesn't exist", () => {
        return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then(({ body}) => {
                expect(body.msg).toBe("Article not found.");
                })
            })
})
describe('/api/articles', () => {
    test('200: should return a list of all the articles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeInstanceOf(Array),
            expect(body.articles.length).toBe(13)
        body.articles.forEach((article) => {
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
        })
    })
    test('200:, should respond with an array of the articles containing a comment_count value equal to the number of comments', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles[0]).toHaveProperty('comment_count', expect.any(String));
        })
    })
    test('200: should respond with an array of articles sorted by date latest', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) =>{
            expect(body.articles).toBeSortedBy("created_at", {descending: true});
        })
    })
})
describe('GET /api/articles/:article_id/comments', () => {
    test('200: should return all the comments for the specific article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toHaveLength(11);
            body.comments.forEach((comment) => comment.article_id === articles.article_id)
            expect(body.comments).toBeSortedBy("created_at", {ascending: true});
            expect(body.comments[0]).toMatchObject({
                article_id: expect.any(Number),
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String)
            })
        })
    })
    test('200: returns a 200 when the article exists, and an empty array of comments when there are no comments on the article', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toHaveLength(0);
            expect(body.comments).toEqual([]);
        })  
    })
    test("404: returns an object with error status 404 and message if given article Id does not exist", () => {
        return request(app)
            .get("/api/articles/999/comments")
            .expect(404)
            .then(({body}) => {
            expect(body.msg).toEqual("Article not found.")
            })
    })
    test("400: responds with an error when article id is in an invalid format", () => {
        return request(app)
            .post("/api/articles/first-article/comments")
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe("Invalid article id.");
            });
    });
})
describe("POST /api/articles/:article_id/comments", () => {
    test("201: should respond with the posted comment", () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            body: 'This article is great!',
            username: 'lurker'
        })
        .expect(201)
        .then(({body}) => {
            body.comment.forEach((comment)=>{
                expect(comment.comment_id).toBe(19),
                expect(comment.author).toEqual('lurker'),
                expect(comment.body).toEqual('This article is great!')
            })
        })
    })
    test("201: response comment has all properties of comment table", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
            username: "butter_bridge",
            body: "Nice one!",
            })
            .expect(201)
            .then(({ body }) => {
                body.comment.forEach((comment)=>{
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                })
            })
    })
    test('400: should inform the user that there are missing elements in the body', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            username: 'lurker'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toEqual('Missing data');
        })
    })
    test("404: responds with an error when given an article_id that doesn't exist", () => {
            return request(app)
            .post("/api/articles/999/comments")
            .send({
                username: "butter_bridge",
                body: "This is a great article!",
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found.");
            })
    })
    test("400: responds with an error when article id is in an invalid format", () => {
        return request(app)
            .post("/api/articles/first-article/comments")
            .send({
                username: "lurker",
                body: "This is a great article!"
            })
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe("Invalid article id.");
            });
    });
    test("404: responds with an error when username doesn't exist", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
            username: "not_a_user",
            body: "This is a great article!"
            })
            .expect(404)
            .then(({ body }) => {
            expect(body.msg).toBe("Invalid username.");
            })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: should return the updated article by article_id', () =>{
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article.votes).toBe(101)
            })
    })
    test('400: should return an error if invalid body', () =>{
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'two' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    })
})
    test("400: responds with an error when article id is in an invalid format", () => {
        return request(app)
            .patch("/api/articles/first-article")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
    })
})
    test("404: responds with an error when given an article_id that doesn't exist", () => {
        return request(app)
            .patch("/api/articles/999")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
            expect(body.msg).toBe("Article not found.");
    })
})

describe('DELETE /api/comments/:comment_id', () =>{
    test('204: should delete the comment by comment_id', () =>{
        return request(app)
        .delete('/api/comments/9')
        .expect(204)
    })
    test('404: should inform the user the comment_id does not exist', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toEqual('Comment not found.')
        })
    })
    test('400: should inform the user the comment_id is incorrect format', () => {
        return request(app)
        .delete('/api/comments/an-id')
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toEqual('Bad request')
        })
    })
});
describe('GET /api/users', ()=>{
    test('200: should respond with all users', () =>{
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) =>{
                expect(body.users).toBeInstanceOf(Array),
                expect(body.users).toHaveLength(4),
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    })
})