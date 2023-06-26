const request = require('supertest')
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    if (db.end) db.end();
});

describe("/api test suite", () => {
    test("200: should respond with an okay message", () => {
    return request(app)
    .get('/api')
    .expect(200)  
    .then(({body}) => {
        expect(body.msg).toBe("Everything is working fine!")
        })
    })
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