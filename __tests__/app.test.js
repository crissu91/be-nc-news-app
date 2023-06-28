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
})