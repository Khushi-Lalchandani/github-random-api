'use strict';

const loading = document.getElementById('loading');
const container = document.getElementById('container');
const languagesUrl =
  'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json';

const languageSelect = document.getElementById('language');

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

  try {
    const apiUrl = `https://api.github.com/search/repositories?q=language:${language}&sort=stars`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const randomRepo =
      data.items[Math.floor(Math.random() * data.items.length)];

    // Simulate a delay before showing the result (e.g., 1 second)
    setTimeout(() => {
      displayRepository(randomRepo);
      loading.classList.add('hidden');
      container.style.display = 'flex';
    }, 1000); // 1000ms = 1 second
  } catch (error) {
    container.innerHTML =
      '<p class="text-red-500">Error loading repositories.</p>';
    loading.classList.add('hidden');
    console.error('Failed to load repositories:', error);
  }
};

const displayRepository = (repo) => {
  container.innerHTML = '';

  const repoContainer = document.createElement('div');
  repoContainer.className =
    'w-[50%] mt-4 h-auto p-3 flex flex-col gap-3 rounded-xl bg-red-200';

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
