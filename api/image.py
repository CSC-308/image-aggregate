class Image():
    def __init__(self, image_id, image_url, tags):
        self.id = image_id
        self.url = image_url
        self.tags = tags

    @staticmethod
    def create(db, image_url, tags):
        query_object = {
            'image URL': image_url,
            'tags': tags
        }

        db.Images.insert_one(query_object)
        return 0
