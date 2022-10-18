import axios from 'axios';


axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = 'key=30551862-9589f733672d30c10c91e5769';
export class PixabayApi {
    #name='';
    #page = 1;
    #perPage = 40;
    #totalPages = 0;
    #params = {
    params: {
        orientation:'horizontal',
        image_type:'photo',
        safesearch:true,
        per_page: 40,
}
};
async  getImages() {
    const urlAXIOS = `?${API_KEY}&q=${this.#name}&page=${this.#page}`;
    const response = await axios.get(urlAXIOS, this.#params);
    return response;
};
set name(newName) {
    this.#name = newName;
  }

  get name() {
    return this.#name;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }
  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }

}
