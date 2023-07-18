import Handlebars from 'handlebars';

const handleSearchBar = () => {
    const field = document.querySelector('input[type="search"]');
    const parent = field.closest('form[role=search]');
    const results = parent.querySelector('.search-results');
    const resultsItemTemplate = results.querySelector('.template').innerHTML;
    let typingTimer;
    let controller = new AbortController();

    field.addEventListener('focusin', () => {
        results.classList.add('show');
    });

    field.addEventListener('focusout', () => {
        results.classList.remove('show');
    });

    field.addEventListener('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, 1000);
    });

    field.addEventListener('keydown', function () {
        clearTimeout(typingTimer);
        controller.abort();
        controller = new AbortController();
    });

    const doneTyping = async () => {
        const call = await fetch('https://jsonplaceholder.typicode.com/posts', { signal: controller.signal });
        const response = await call.json();

        results.querySelectorAll('.dynamic').forEach((item) => {
            item.remove();
        });

        response.forEach((post, index) => {
            if(index >= 3){
                return;
            }

            const template = Handlebars.compile(resultsItemTemplate);
            results.insertAdjacentHTML('afterbegin', `<div class="search-results-item dynamic">${template(post)}</div>`);
        })

    }

}

export default handleSearchBar;