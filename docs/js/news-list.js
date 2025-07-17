// ニュース一覧の拡張機能JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== News List JS Starting ===');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    // 現在のページがニュースアーカイブページかどうかを確認
    const isNewsPage = window.location.pathname === '/news/' || 
                      window.location.pathname.endsWith('/news/index.html');
    
    console.log('Is news page?', isNewsPage);
    
    if (!isNewsPage) {
        console.log('Not a news page, exiting...');
        return; // ニュースアーカイブページでない場合は処理を中断
    }
    // ページ内のfilter関連要素を調査
    console.log('=== Investigating filter elements ===');
    const allFilterGroups = document.querySelectorAll('.filter-group');
    console.log('Found filter-groups:', allFilterGroups.length);
    allFilterGroups.forEach((group, index) => {
        console.log(`Filter group ${index}:`, group.innerHTML);
    });
    
    const allFilterButtons = document.querySelectorAll('.filter-button');
    console.log('Found filter-buttons:', allFilterButtons.length);
    allFilterButtons.forEach((button, index) => {
        console.log(`Filter button ${index}:`, button.textContent, button.dataset.category);
    });
    
    const allNewsFilters = document.querySelectorAll('.news-filters');
    console.log('Found news-filters:', allNewsFilters.length);
    allNewsFilters.forEach((filter, index) => {
        console.log(`News filter ${index}:`, filter.innerHTML.substring(0, 200) + '...');
    });
    console.log('=== End investigation ===');
    
    // 古いフィルターボタンを削除（もし存在する場合）
    const oldFilterButtons = document.querySelectorAll('.filter-button');
    if (oldFilterButtons.length > 0) {
        console.log('Removing old filter buttons...');
        oldFilterButtons.forEach(button => {
            const parent = button.parentElement;
            if (parent && parent.classList.contains('filter-group') && parent.querySelector('.filter-label')) {
                console.log('Removing old filter group with buttons');
                parent.remove();
            }
        });
    }
    
    const newsContainer = document.getElementById('newsContainer');
    // 重要: このページのnewsContainer内の記事のみを取得
    const newsEntries = newsContainer ? 
        Array.from(newsContainer.querySelectorAll('.news-entry')) : 
        [];
    const searchInput = document.getElementById('newsSearch');
    const searchClear = document.getElementById('searchClear');
    const yearFilter = document.getElementById('yearFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    // ビュー切り替えボタンを削除（グリッド表示固定）
    // const viewButtons = document.querySelectorAll('.view-button');
    const pagination = document.getElementById('pagination');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const noResultsDiv = document.getElementById('noResults');
    const yearButtons = document.querySelectorAll('.year-button');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    const resultsCount = document.getElementById('resultsCount');
    
    // デバッグ：要素の確認
    console.log('CategoryFilter element:', categoryFilter);
    console.log('NewsEntries count:', newsEntries.length);
    if (categoryFilter) {
        console.log('CategoryFilter options:', Array.from(categoryFilter.options).map(opt => opt.value));
    }
    
    // デバッグ：各エントリーのカテゴリーを確認
    console.log('=== News entries categories ===');
    newsEntries.forEach((entry, index) => {
        const title = entry.querySelector('.news-tile-title')?.textContent || 'No title';
        const categories = entry.dataset.categories || '';
        console.log(`Entry ${index}: ${title}`);
        console.log(`  Categories string: "${categories}"`);
        console.log(`  Categories array:`, categories.split(' ').filter(cat => cat.trim()));
    });
    console.log('=== End of entries ===');
    
    let currentPage = 1;
    let itemsPerPage = 100; // グリッド表示固定
    let filteredEntries = [...newsEntries];
    
    
    // グリッドスタイルを強制的に適用（拡張版）
    function forceGridStyle() {
        if (newsContainer && newsContainer.classList.contains("news-grid")) {
            // インラインスタイルを強制的に適用 - 4列表示
            newsContainer.style.cssText = "display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 20px !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important;";
            
            // 各アイテムのスタイルをリセット（重要）
            const items = newsContainer.querySelectorAll('.list-item');
            items.forEach(item => {
                // display以外のスタイルプロパティをリセット
                item.style.width = '';
                item.style.maxWidth = '';
                item.style.margin = '';
                item.style.padding = '';
                item.style.visibility = '';
                item.style.opacity = '';
            });
        }
    }
    
    // 初期化時に実行
    forceGridStyle();
    
    // DOMContentLoadedの後にも実行
    setTimeout(forceGridStyle, 100);
    
    // ウィンドウリサイズ時にも実行
    window.addEventListener('resize', forceGridStyle);
    // フィルタリング関数
    function filterNews() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedYear = yearFilter ? yearFilter.value : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        
        console.log('=== Filter News Debug ===');
        console.log('Search term:', searchTerm);
        console.log('Selected year:', selectedYear);
        console.log('Selected category:', selectedCategory);
        console.log('Total entries before filter:', newsEntries.length);
        
        filteredEntries = newsEntries.filter(entry => {
            const title = entry.dataset.title || '';
            const content = entry.dataset.content || '';
            const year = entry.dataset.year;
            const categories = entry.dataset.categories || '';
            
            // デバッグ用（最初の数エントリーのみログ出力）
            const entryIndex = newsEntries.indexOf(entry);
            if (entryIndex < 3) {
                console.log(`\nEntry ${entryIndex}:`);
                console.log('  Title:', entry.querySelector('.news-tile-title')?.textContent);
                console.log('  Year:', year);
                console.log('  Categories string:', categories);
                console.log('  Categories array:', categories.split(' ').filter(cat => cat.trim()));
            }
            
            const matchesSearch = !searchTerm || 
                title.includes(searchTerm) || 
                content.includes(searchTerm);
            
            const matchesYear = !selectedYear || year === selectedYear;
            
            // カテゴリーのマッチングを改善
            const categoriesArray = categories.split(' ').filter(cat => cat.trim());
            const matchesCategory = !selectedCategory || categoriesArray.includes(selectedCategory);
            
            const matches = matchesSearch && matchesYear && matchesCategory;
            
            // デバッグ：マッチング結果を最初の数エントリーのみ出力
            if (entryIndex < 3 && (selectedYear || selectedCategory)) {
                console.log(`  Matches search: ${matchesSearch}`);
                console.log(`  Matches year: ${matchesYear}`);
                console.log(`  Matches category: ${matchesCategory}`);
                console.log(`  Overall match: ${matches}`);
            }
            
            return matches;
        });
        
        console.log('Filtered entries count:', filteredEntries.length);
        console.log('=== End Filter News Debug ===');
        
        currentPage = 1;
        displayNews();
        updateResultsCount();
    }
    
    // 結果数を更新
    function updateResultsCount() {
        if (resultsCount) {
            resultsCount.textContent = filteredEntries.length;
        }
    }
    
    // ニュース表示関数
    function displayNews() {
        console.log('=== DisplayNews Debug ===');
        console.log('Total entries:', newsEntries.length);
        console.log('Filtered entries:', filteredEntries.length);
        console.log('Current page:', currentPage);
        console.log('Items per page:', itemsPerPage);
        
        // フィルターされたエントリーの詳細を表示
        console.log('Filtered entries details:');
        filteredEntries.forEach((entry, index) => {
            const title = entry.querySelector('.news-tile-title')?.textContent || 'No title';
            console.log(`  ${index}: ${title}`);
        });
        console.log('=== End DisplayNews Debug ===');
        
        const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // すべての記事を非表示（!importantを使用）
        newsEntries.forEach(entry => {
            entry.style.setProperty('display', 'none', 'important');
        });
        
        // フィルタリングされた記事のみ表示
        filteredEntries.slice(startIndex, endIndex).forEach(entry => {
            entry.style.setProperty('display', 'block', 'important');
        });
        
        // ページネーション更新
        if (currentPageSpan) currentPageSpan.textContent = currentPage;
        if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
        
        if (prevButton) prevButton.disabled = currentPage === 1;
        if (nextButton) nextButton.disabled = currentPage === totalPages;
        
        // ページネーション表示/非表示
        if (pagination) {
            if (totalPages > 1) {
                pagination.style.display = 'flex';
            } else {
                pagination.style.display = 'none';
            }
        }
        
        // 検索結果なしメッセージ
        if (filteredEntries.length === 0) {
            if (noResultsDiv) noResultsDiv.style.display = 'block';
            if (newsContainer) newsContainer.style.display = 'none';
        } else {
            if (noResultsDiv) noResultsDiv.style.display = 'none';
            if (newsContainer) {
                newsContainer.style.display = '';  // 空文字列にしてデフォルトスタイルを使用
                // グリッド表示の場合、スタイルを再適用
                if (newsContainer.classList.contains('news-grid')) {
                    setTimeout(forceGridStyle, 10);
                }
            }
        }
    }
    
    // 検索クリアボタンの表示/非表示
    function updateSearchClear() {
        if (searchClear && searchInput) {
            searchClear.style.display = searchInput.value ? 'flex' : 'none';
        }
    }
    
    // イベントリスナー
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            updateSearchClear();
            filterNews();
        });
    }
    
    // 検索クリアボタン
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            updateSearchClear();
            filterNews();
            searchInput.focus();
        });
    }
    
    // サジェストタグのクリック
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const keyword = tag.dataset.keyword;
            searchInput.value = keyword;
            updateSearchClear();
            filterNews();
        });
    });
    
    if (yearFilter) {
        yearFilter.addEventListener('change', filterNews);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterNews);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayNews();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayNews();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    // ビュー切り替え機能を削除（グリッド表示固定）
    /*
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            if (view === 'grid') {
                newsContainer.classList.remove('news-list-view');
                newsContainer.classList.add('news-grid');
                itemsPerPage = 100; // グリッド表示は多くのアイテムを表示
                // グリッドビューに切り替えた後、スタイルを強制適用
                setTimeout(forceGridStyle, 10);
            } else {
                newsContainer.classList.remove('news-grid');
                newsContainer.classList.add('news-list-view');
                itemsPerPage = 10; // リスト表示は10件ずつ
            }
            currentPage = 1; // ページをリセット
            displayNews(); // 表示を更新
        });
    });
    */
    
    // 年別アーカイブボタン
    yearButtons.forEach(button => {
        button.addEventListener('click', () => {
            const year = button.dataset.year;
            yearFilter.value = year;
            filterNews();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // 初期表示
    if (searchInput || yearFilter) {
        updateSearchClear();
    }
    displayNews();
});
