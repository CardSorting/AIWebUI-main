"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var sqlite3 = require('sqlite3');
var Pool = require('pg').Pool;
var path = require('path');
var dotenv = require('dotenv');
var uuidv4 = require('uuid').v4;
var sqlite = require('sqlite');
// Load environment variables
dotenv.config();
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var dbPath, sqliteDb, pg, sqliteUsers, idMapping_1, users, _i, users_1, user, images, _a, images_1, image, newUserId, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dbPath = path.join(process.cwd(), 'database.sqlite');
                    return [4 /*yield*/, sqlite.open({
                            filename: dbPath,
                            driver: sqlite3.Database
                        })];
                case 1:
                    sqliteDb = _b.sent();
                    pg = new Pool({
                        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ukedAhWBKMnlkFQAnBylDuHDkkWYeMhY@monorail.proxy.rlwy.net:50047/railway'
                    });
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 14, 15, 18]);
                    // Create tables in PostgreSQL
                    return [4 /*yield*/, pg.query("\n      CREATE TABLE IF NOT EXISTS users (\n        id UUID PRIMARY KEY,\n        email VARCHAR(255) UNIQUE NOT NULL,\n        password VARCHAR(255) NOT NULL,\n        name VARCHAR(255) NOT NULL,\n        credits INTEGER NOT NULL DEFAULT 10,\n        membership_tier VARCHAR(50),\n        membership_expiry TIMESTAMP,\n        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n      );\n\n      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);\n      CREATE INDEX IF NOT EXISTS idx_users_membership ON users(membership_tier, membership_expiry);\n\n      DROP TABLE IF EXISTS image_metadata;\n      \n      CREATE TABLE IF NOT EXISTS image_metadata (\n        id SERIAL PRIMARY KEY,\n        prompt TEXT,\n        imageUrl TEXT,\n        backblazeUrl TEXT,\n        seed INTEGER,\n        width INTEGER,\n        height INTEGER,\n        contentType TEXT,\n        hasNsfwConcepts TEXT,\n        fullResult TEXT,\n        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n        userId UUID REFERENCES users(id)\n      );\n    ")];
                case 3:
                    // Create tables in PostgreSQL
                    _b.sent();
                    // Migrate users
                    console.log('Migrating users...');
                    return [4 /*yield*/, sqliteDb.all('SELECT * FROM users')];
                case 4:
                    sqliteUsers = _b.sent();
                    idMapping_1 = new Map();
                    users = sqliteUsers.map(function (user) {
                        var newId = uuidv4();
                        idMapping_1.set(user.id, newId);
                        return {
                            id: newId,
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            credits: user.credits || 10,
                            membershipTier: user.membershipTier || null,
                            membershipExpiry: user.membershipExpiry ? new Date(user.membershipExpiry) : null
                        };
                    });
                    _i = 0, users_1 = users;
                    _b.label = 5;
                case 5:
                    if (!(_i < users_1.length)) return [3 /*break*/, 8];
                    user = users_1[_i];
                    return [4 /*yield*/, pg.query("INSERT INTO users (id, name, email, password, credits, membership_tier, membership_expiry)\n         VALUES ($1, $2, $3, $4, $5, $6, $7)\n         ON CONFLICT (id) DO UPDATE SET\n           name = EXCLUDED.name,\n           email = EXCLUDED.email,\n           password = EXCLUDED.password,\n           credits = EXCLUDED.credits,\n           membership_tier = EXCLUDED.membership_tier,\n           membership_expiry = EXCLUDED.membership_expiry", [
                            user.id,
                            user.name,
                            user.email,
                            user.password,
                            user.credits,
                            user.membershipTier,
                            user.membershipExpiry
                        ])];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("Migrated ".concat(users.length, " users"));
                    // Migrate image metadata
                    console.log('Migrating image metadata...');
                    return [4 /*yield*/, sqliteDb.all('SELECT * FROM image_metadata')];
                case 9:
                    images = _b.sent();
                    _a = 0, images_1 = images;
                    _b.label = 10;
                case 10:
                    if (!(_a < images_1.length)) return [3 /*break*/, 13];
                    image = images_1[_a];
                    newUserId = idMapping_1.get(Number(image.userId));
                    if (!newUserId) {
                        console.warn("Skipping image ".concat(image.id, " - user ").concat(image.userId, " not found"));
                        return [3 /*break*/, 12];
                    }
                    return [4 /*yield*/, pg.query("INSERT INTO image_metadata (\n          id, prompt, imageUrl, backblazeUrl, seed, width, height,\n          contentType, hasNsfwConcepts, fullResult, createdAt, userId\n        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)\n        ON CONFLICT (id) DO UPDATE SET\n          prompt = EXCLUDED.prompt,\n          imageUrl = EXCLUDED.imageUrl,\n          backblazeUrl = EXCLUDED.backblazeUrl,\n          seed = EXCLUDED.seed,\n          width = EXCLUDED.width,\n          height = EXCLUDED.height,\n          contentType = EXCLUDED.contentType,\n          hasNsfwConcepts = EXCLUDED.hasNsfwConcepts,\n          fullResult = EXCLUDED.fullResult,\n          createdAt = EXCLUDED.createdAt,\n          userId = EXCLUDED.userId", [
                            image.id,
                            image.prompt,
                            image.imageUrl,
                            image.backblazeUrl,
                            image.seed,
                            image.width,
                            image.height,
                            image.contentType,
                            image.hasNsfwConcepts,
                            image.fullResult,
                            image.createdAt,
                            newUserId
                        ])];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13:
                    console.log("Migrated ".concat(images.length, " images"));
                    console.log('Migration completed successfully!');
                    return [3 /*break*/, 18];
                case 14:
                    error_1 = _b.sent();
                    console.error('Migration failed:', error_1);
                    throw error_1;
                case 15: return [4 /*yield*/, sqliteDb.close()];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, pg.end()];
                case 17:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
// Run migration
migrate()["catch"](console.error);
