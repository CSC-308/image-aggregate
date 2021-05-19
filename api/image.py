class Image():
    
    @staticmethod
    def create(db, image_url, tags):
        query_object = {
            'image URL': image_url,
            'tags': tags
        }

        db.Images.insert_one(query_object)
        return 0
