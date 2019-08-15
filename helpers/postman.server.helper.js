const { request } = require('https');

const defaults = {
  hostname: 'api.getpostman.com',
  method: 'GET',
};

class Basic {
  /**
   * Call this method to change postman key
   * @param {String} key The postman key
   */
  setKey(key = '') {
    if (key && key !== this.key) {
      this.key = key;
    }
  }

  /**
   * Check if the current instance contains a valid key
   */
  checkKey() {
    if (!this.key) {
      throw new Error('No key was found. Please specify a key by calling "setKey(key)" method.');
    }
  }
}

function sendRequest(options, body) {
  return new Promise((resolve, reject) => {
    const apiReq = request(
      {
        ...defaults,
        ...options,
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          data = JSON.parse(data);

          if (res.statusCode === 200) {
            return resolve(data);
          }
          return reject(data);
        });
      },
    );

    apiReq.on('error', e => resolve(e));

    if (body) {
      apiReq.write(JSON.stringify(body));
    }

    apiReq.end();
  });
}

/**
 * Collection class
 */
exports.Collection = class Collection extends Basic {
  /**
   * Returns the list of all collections that are accessible by you.
   * The list includes your own collections and the collections that you have subscribed to.
   */
  async all() {
    this.checkKey();

    const { collections } = await sendRequest({
      path: '/collections',
      headers: {
        'X-Api-Key': this.key,
      },
    });

    return collections;
  }

  /**
   * Access the contents of a collection that is accessible to you using its unique id
   * @param {String} id The collection ID
   */
  async one(id) {
    this.checkKey();

    const { collection } = await sendRequest({
      path: `/collections/${id}`,
      headers: {
        'X-Api-Key': this.key,
      },
    });

    return collection;
  }

  /**
   * This endpoint allows you to create collections using the Postman Collection v2 format.
   * @param {Object} payload The collection details
   */
  async create(payload) {
    this.checkKey();

    const { collection } = await sendRequest(
      {
        path: '/collections',
        method: 'POST',
        headers: {
          'X-Api-Key': this.key,
          'Content-Type': 'application/json',
        },
      },
      { collection: payload },
    );

    return collection;
  }

  /**
   * This endpoint allows you to update an existing collection using the Postman Collection
   * v2 format
   * @param {String} id The collection ID
   * @param {Object} payload The collection details
   */
  async update(id, payload) {
    this.checkKey();

    const { collection } = await sendRequest(
      {
        path: `/collections/${id}`,
        method: 'PUT',
        headers: {
          'X-Api-Key': this.key,
          'Content-Type': 'application/json',
        },
      },
      { collection: payload },
    );

    return collection;
  }

  /**
   * This endpoint allows you to delete an existing collection.
   * @param {String} id The collection ID
   */
  async remove(id) {
    this.checkKey();

    const { collection } = await sendRequest({
      path: `/collections/${id}`,
      method: 'DELETE',
      headers: {
        'X-Api-Key': this.key,
      },
    });

    return collection;
  }
};
