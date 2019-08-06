'use strict';

const Service = require('egg').Service;

class ImageService extends Service {
    async upload(folderName, fileType) {

        var imageName;
        let result1 = await this.app.mysql.select('image', {
            columns: ['id'],
            orders: [['id', 'desc']]
        })
        if (result1.length === 0) {
            imageName = '1.' + fileType;
        } else {
            imageName = (result1[0].id+1) + '.' + fileType
        }
        let url = '/public/images/uploads/' + folderName +'/'+ imageName;
        let result2 = await this.app.mysql.insert('image', {
            image_url: url
        });
        if (result2.affectedRows === 1) {
            return {
                "imageName": imageName,
                "url": '47.96.95.75:7001' + url
            }
        }
        return null;
    }
}

module.exports = ImageService;
