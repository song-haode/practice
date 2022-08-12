import Storage from 'mars-storage';

const storage = new Storage({
  type: 'localStorage',
  prefix: '__mango__'
});

const sessionStore = new Storage({
  type: 'sessionStorage',
  prefix: '__mango__'
});

export default storage;
export { sessionStore };
