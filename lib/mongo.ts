import { 
  MongoClient, 
  Collection, 
  Document, 
  Filter, 
  UpdateFilter,
  FindOneAndUpdateOptions,
  InsertOneResult,
  UpdateResult,
  DeleteResult,
  OptionalUnlessRequiredId,
  WithId,
  ObjectId,
} from 'mongodb';

const uri: string = process.env.MONGODB_URI!;
const options = {};

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ----------------------------------------------------------------
// Base collection accessor
// ----------------------------------------------------------------
export async function getMongoCollection<T extends Document = Document>(
  collectionName: string
): Promise<Collection<T>> {
  const client = await clientPromise;
  return client.db(process.env.MONGO_DB_NAME).collection<T>(collectionName);
}

// ----------------------------------------------------------------
// INSERT ONE
// ----------------------------------------------------------------
export async function insertOne<T extends Document>(
  collectionName: string,
  document: Omit<T, '_id' | 'createdAt' | 'updatedAt'>
): Promise<WithId<T>> {
  const collection = await getMongoCollection<T>(collectionName);
  const now = new Date();
  const doc = {
    ...document,
    createdAt: now,
    updatedAt: now,
  } as unknown as OptionalUnlessRequiredId<T>;

  const result: InsertOneResult<T> = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId } as WithId<T>;
}

// ----------------------------------------------------------------
// INSERT MANY
// ----------------------------------------------------------------
export async function insertMany<T extends Document>(
  collectionName: string,
  documents: Omit<T, '_id' | 'createdAt' | 'updatedAt'>[]
): Promise<number> {
  const collection = await getMongoCollection<T>(collectionName);
  const now = new Date();
  const docs = documents.map((doc) => ({
    ...doc,
    createdAt: now,
    updatedAt: now,
  })) as unknown as OptionalUnlessRequiredId<T>[];

  const result = await collection.insertMany(docs);
  return result.insertedCount;
}

// ----------------------------------------------------------------
// FIND ONE
// ----------------------------------------------------------------
export async function findOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>
): Promise<WithId<T> | null> {
  const collection = await getMongoCollection<T>(collectionName);
  return collection.findOne(filter);
}

// ----------------------------------------------------------------
// FIND ONE BY ID
// ----------------------------------------------------------------
export async function findById<T extends Document>(
  collectionName: string,
  id: string | ObjectId
): Promise<WithId<T> | null> {
  const collection = await getMongoCollection<T>(collectionName);
  return collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
}

// ----------------------------------------------------------------
// FIND MANY
// ----------------------------------------------------------------
export async function findMany<T extends Document>(
  collectionName: string,
  filter: Filter<T> = {},
  options?: { limit?: number; skip?: number; sort?: Record<string, 1 | -1>, projection?: Partial<Record<keyof T, 0 | 1>> },
): Promise<WithId<T>[]> {
  const collection = await getMongoCollection<T>(collectionName);
  let cursor = collection.find(filter, {
    projection: options?.projection,
  });
  if (options?.sort)  cursor = cursor.sort(options.sort);
  if (options?.skip)  cursor = cursor.skip(options.skip);
  if (options?.limit) cursor = cursor.limit(options.limit);

  return cursor.toArray();
}

// ----------------------------------------------------------------
// UPDATE ONE  (returns updated document)
// ----------------------------------------------------------------
export async function updateOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  update: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>,
  options?: FindOneAndUpdateOptions
): Promise<WithId<T> | null> {
  const collection = await getMongoCollection<T>(collectionName);
  const result = await collection.findOneAndUpdate(
    filter,
    {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    } as unknown as UpdateFilter<T>,
    { returnDocument: 'after', ...options }
  );
  return result ?? null;
}

// ----------------------------------------------------------------
// UPDATE ONE BY ID
// ----------------------------------------------------------------
export async function updateById<T extends Document>(
  collectionName: string,
  id: string | ObjectId,
  update: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<WithId<T> | null> {
  return updateOne<T>(
    collectionName,
    { _id: new ObjectId(id) } as Filter<T>,
    update
  );
}

// ----------------------------------------------------------------
// UPDATE MANY
// ----------------------------------------------------------------
export async function updateMany<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  update: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<UpdateResult> {
  const collection = await getMongoCollection<T>(collectionName);
  return collection.updateMany(filter, {
    $set: {
      ...update,
      updatedAt: new Date(),
    },
  } as unknown as UpdateFilter<T>);
}

// ----------------------------------------------------------------
// DELETE ONE
// ----------------------------------------------------------------
export async function deleteOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>
): Promise<boolean> {
  const collection = await getMongoCollection<T>(collectionName);
  const result: DeleteResult = await collection.deleteOne(filter);
  return result.deletedCount === 1;
}

// ----------------------------------------------------------------
// DELETE BY ID
// ----------------------------------------------------------------
export async function deleteById<T extends Document>(
  collectionName: string,
  id: string | ObjectId
): Promise<boolean> {
  return deleteOne<T>(
    collectionName,
    { _id: new ObjectId(id) } as Filter<T>
  );
}

// ----------------------------------------------------------------
// SOFT DELETE  (sets status to DELETED instead of removing)
// ----------------------------------------------------------------
export async function softDeleteById<T extends Document>(
  collectionName: string,
  id: string | ObjectId
): Promise<WithId<T> | null> {
  return updateById<T>(collectionName, id, {
    status: 'DELETED',
  } as unknown as Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>);
}

// ----------------------------------------------------------------
// COUNT
// ----------------------------------------------------------------
export async function countDocuments<T extends Document>(
  collectionName: string,
  filter: Filter<T> = {}
): Promise<number> {
  const collection = await getMongoCollection<T>(collectionName);
  return collection.countDocuments(filter);
}

export default clientPromise;