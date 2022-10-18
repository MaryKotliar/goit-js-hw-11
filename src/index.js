import './css/styles.css';
import { refs } from './refs';
import { PixabayApi} from './pixabay'
import { Notify } from 'notiflix';
import { createMarkup } from './createMarkup';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

refs.form.addEventListener('submit', onSumbitBtn);
refs.loadmoreBtn.addEventListener('click', onLoadmoreBtn);

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250, spinner:true });
const pixabay = new PixabayApi();

async function onSumbitBtn(event){
    event.preventDefault();
    const searchName = refs.input.value.trim().toLowerCase();
    if (!searchName){
        Notify.info('Enter your search information');
        return
    }
    pixabay.name = searchName;
    clearPage();
    try {
        const {data:{hits, totalHits}} = await pixabay.getImages();
        
        if(hits.length === 0) {
            console.log(hits.length);
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return;
        }
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
        lightbox.refresh();
        Notify.success(`"Hooray! We found ${totalHits} images."`)
        pixabay.calculateTotalPages(totalHits)
        if(pixabay.isShowLoadMore) {
            refs.loadmoreBtn.classList.remove('is-hidden')
            return
            } else {
            Notify.info('We are sorry, but you have reached the end of search results.')
            }  
        }
        catch (error)  {Notify.failure(error.message, 'Something is wrong');
        clearPage()}
    }

function clearPage() {
    
    pixabay.resetPage();
    refs.gallery.innerHTML ="";
    refs.loadmoreBtn.classList.add('is-hidden');
}
async function onLoadmoreBtn() {
    pixabay.incrementPage();
    try {
    const {data:{hits}} = await pixabay.getImages();
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    lightbox.refresh();
    smoothScroll();
    if (!pixabay.isShowLoadMore) {
        refs.loadmoreBtn.classList.add('is-hidden')
        Notify.info('We are sorry, but you have reached the end of search results.')
    }
        return
    } 
    catch (error)  {Notify.failure(error.message, 'Something is wrong');
        clearPage()};
        }
function smoothScroll() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
}
