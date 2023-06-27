const request = require('supertest')
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const endpoints = require('../endpoints.json')

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
                expect(typeof body.article[0]).toBe("object"),
                expect(body.article[0].article_id).toBe(3),
                expect(body.article[0]).toHaveProperty(
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
    test("status: 400 responds with an error when article_id is not an integer", () => {
        return request(app)
            .get("/api/articles/first_article")
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe("Bad request")
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
