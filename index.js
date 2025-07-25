'use strict';

const loading = document.getElementById('loading');
const container = document.getElementById('container');
const languagesUrl =
  'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json';

const languageSelect = document.getElementById('language');
const actionButton = document.getElementById('actionButton');
let previousRepoId = null;

if (languageSelect.value === '') {
  console.log('Language select element not found');
}

const loadLanguages = async () => {
  const response = await fetch(languagesUrl);
  const languages = await response.json();
  languages.forEach((language) => {
    const option = document.createElement('option');

    option.value = language.value;
    option.textContent = language.title;
    languageSelect.appendChild(option);
  });
};

const loadRepositories = async (language) => {
  loading.classList.remove('hidden');
  container.innerHTML = '';
  container.style.display = 'none';
  actionButton.classList.add('hidden');

  try {
    const apiUrl = `https://api.github.com/search/repositories?q=language:${language}&sort=stars`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      showRetry(language);
      loading.classList.add('hidden');
      return;
    }

    let filteredItems = data.items;
    if (previousRepoId !== null && data.items.length > 1) {
      filteredItems = data.items.filter((item) => item.id !== previousRepoId);
    }

    const randomRepo =
      filteredItems[Math.floor(Math.random() * filteredItems.length)];
    previousRepoId = randomRepo?.id || null;

    setTimeout(() => {
      if (randomRepo) {
        displayRepository(randomRepo);

        container.className =
          'w-full mt-4 h-auto p-3 flex flex-col gap-3 rounded-xl bg-gray-200';

        actionButton.textContent = 'Refresh';
        actionButton.className = 'px-4 py-2 mt-4 rounded text-white bg-black';
        actionButton.classList.remove('hidden');
        actionButton.onclick = () => loadRepositories(language);
      } else {
        showRetry(language);
      }

      loading.classList.add('hidden');
      container.style.display = 'flex';
    }, 1000);
  } catch (error) {
    showRetry(language);
    loading.classList.add('hidden');
    console.error('Failed to load repositories:', error);
  }
};

const showRetry = (language) => {
  container.innerHTML =
    '<p class="text-red-700 text-lg">No repository found.</p>';
  container.className =
    'w-full mt-4 h-auto p-3 flex flex-col gap-3 rounded-xl bg-red-300';

  actionButton.textContent = 'Retry';
  actionButton.className = 'px-4 py-2 mt-4 rounded text-white bg-red-600';
  actionButton.classList.remove('hidden');

  actionButton.onclick = () => loadRepositories(language);
};

const displayRepository = (repo) => {
  container.innerHTML = '';

  const repoContainer = document.createElement('div');
  repoContainer.className =
    'w-[100%] mt-4 h-auto p-3 flex flex-col gap-3 rounded-xl';

  const html = `

    <h1 class="text-2xl font-bold">${repo.language}</h1>
            <p>${repo.description}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fa fa-solid text-amber-500 fa-circle"></i>
                <span class="text-sm">${repo.name}</span>
              </div>

              <div class="flex items-center gap-2">
                <i class="fa fa-solid fa-star fa-md"></i>
                <span class="text-sm">${repo.stargazers_count}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="fa fa-solid fa-code-fork fa-md"></i>
                <span class="text-sm">${repo.forks_count}</span>
              </div>

              <div class="flex items-center gap-1">
                <i class="fa fa-exclamation-circle"></i>
                <span class="text-sm">${repo.open_issues_count}</span>
              </div>
            </div>
    
    `;

  repoContainer.innerHTML = html;
  container.appendChild(repoContainer);
};

languageSelect.addEventListener('change', (e) => {
  const selectedLanguage = e.target.value;
  if (selectedLanguage) {
    loadRepositories(selectedLanguage);
  } else {
    container.innerHTML = '<p>Please select a language</p>';
  }
});
loadLanguages();
