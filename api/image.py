class Image():

    @staticmethod
    def create(db, image):
        query_object = {
            'image URL': image['image URL'],
            'tags': image['tags']
        }

        if db['Images'].find_one({'url': image['image URL']}) is not None:
            return None

        image_id = db['Images'].insert_one(query_object)
        return Image.get(db, image_id)

    @staticmethod
    def get(db, img_id):
        return db['Images'].find_one({'_id': img_id})

    @staticmethod
    def get_images(db, image_ids):
        return [image for image in db['Images'].find()
                if str(image['_id']) in image_ids]
