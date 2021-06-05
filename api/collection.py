class Collection():

    @staticmethod
    def create(db, collection, creator_id):
        query_object = {
            'name': collection['name'],
            'description': collection['description'],
            'creator': collection['creator'],
            'private': collection['private'],
            'images': []
        }

        user = db['Users'].find_one({'_id': creator_id})

        for collection_id in user['collections']:
            user_collection = db['Image Collections'].find_one({'_id': collection_id})
            if collection['name'] == user_collection['name']:
                return None

        collection_id = db['Image Collections'].insert_one(query_object).inserted_id
        db['Users'].update({'_id': creator_id}, {'$push': {'collections': collection_id}})

        return Collection.get(db, collection_id)

    @staticmethod
    def delete(db, collection_id):
        return db['Image Collections'].delete_one({'_id': collection_id})

    @staticmethod
    def get(db, collection_id):
        return db['Image Collections'].find_one({'_id': collection_id})

    @staticmethod
    def addImage(db, collection_id, img):
        return db['Image Collections'].update({'_id': collection_id}, {'$push': {'images': img_id}})

    @staticmethod
    def removeImage(db, collection_id, img):
        return db['Image Collections'].update({'_id': collection_id}, {'$pull': {'images': img_id}})
