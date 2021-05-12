class Collection():

    def __init__(self, collection_id, name, description, creator, private):
        self.id = collection_id
        self.name = name
        self.description = description
        self.creator = creator
        self.private = private
        self.images = []

    @staticmethod
    def create(db, name, description, creator, creator_id, private):
        query_object = {
            'name': name,
            'description': description,
            'creator': creator,
            'private': private,
            'images': []
        }

        collection_id = db['Image Collections'].insert__one(query_object)
        db.Users.update({'_id': creator_id.id}, {'$push': {'collections': collection_id}})

        return 0

    @staticmethod
    def get(db, collection_id):
        return db['Image Collections'].find_one({'_id': collection_id})

    @staticmethod
    def addImage(db, collection_id, img):
        db['Image Collections'].update({'_id': collection_id}, {'$push': {'images': img.id}})
        return 0

    @staticmethod
    def removeImage(db, collection_id, img):
        db['Image Collections'].update({'_id': collection_id}, {'$pull': {'images': img.id}})
        return 0
