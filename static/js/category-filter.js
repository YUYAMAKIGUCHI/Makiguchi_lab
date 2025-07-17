// カテゴリー・タクソノミーページ用のフィルタリング機能
console.log('category-filter.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired');
    
    // 現在のページがカテゴリーページかどうかを確認
    const isCategoryPage = window.location.pathname.includes('/categories/') || 
                          window.location.pathname.includes('/tags/');
    
    console.log('Current pathname:', window.location.pathname);
    console.log('Is category page?', isCategoryPage);
    
    if (!isCategoryPage) {
        console.log('Not a category page, exiting...');
        return; // カテゴリーページでない場合は処理を中断
    }
    
    const newsContainer = document.getElementById('newsContainer');
    // 重要: このページのnewsContainer内の記事のみを取得
    const newsEntries = newsContainer ? 
        Array.from(newsContainer.querySelectorAll('.news-entry')) : 
        [];
    
    // デバッグ: newsContainerの内容を確認
    console.log('=== Checking newsContainer structure ===');
    console.log('newsContainer found:', !!newsContainer);
    if (newsContainer) {
        console.log('newsContainer classes:', newsContainer.className);
        console.log('newsContainer children count:', newsContainer.children.length);
        
        // .news-entryと.list-itemの両方を確認
        const newsEntryElements = newsContainer.querySelectorAll('.news-entry');
        const listItemElements = newsContainer.querySelectorAll('.list-item');
        console.log('.news-entry elements:', newsEntryElements.length);
        console.log('.list-item elements:', listItemElements.length);
        
        // 両方のクラスを持つ要素を確認
        const bothClasses = newsContainer.querySelectorAll('.list-item.news-entry');
        console.log('Elements with both classes:', bothClasses.length);
    }
    
    const yearFilter = document.getElementById('yearFilter');
    const pagination = document.getElementById('pagination');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const noResultsDiv = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    // デバッグ情報
    console.log('Category Filter: Page path:', window.location.pathname);
    console.log('Category Filter: News entries found:', newsEntries.length);
    console.log('Category Filter: Year filter element:', yearFilter);
    if (yearFilter) {
        console.log('Category Filter: Year filter options:', yearFilter.options);
    }
    
    let currentPage = 1;
    let itemsPerPage = 100; // グリッド表示固定
    let filteredEntries = [...newsEntries];
    
    // グリッドスタイルを強制的に適用
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
        const selectedYear = yearFilter ? yearFilter.value : '';
        console.log('Category Filter: filterNews called, selectedYear:', selectedYear);
        
        filteredEntries = newsEntries.filter(entry => {
            const year = entry.dataset.year;
            const matchesYear = !selectedYear || year === selectedYear;
            console.log('Entry year:', year, 'matches:', matchesYear);
            return matchesYear;
        });
        
        console.log('Category Filter: Filtered entries:', filteredEntries.length);
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
        console.log('=== displayNews called ===');
        console.log('All news entries:', newsEntries.length);
        console.log('Filtered entries:', filteredEntries.length);
        
        // デバッグ: すべてのエントリーの状態を確認
        console.log('--- Checking all entries before display ---');
        newsEntries.forEach((entry, index) => {
            const title = entry.querySelector('.news-tile-title')?.textContent || 'No title';
            const isInFiltered = filteredEntries.includes(entry);
            console.log(`Entry ${index}: ${title} - In filtered: ${isInFiltered}`);
        });
        
        const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // すべての記事を非表示（!importantを使用）
        newsEntries.forEach(entry => {
            entry.style.setProperty('display', 'none', 'important');
            // デバッグ用
            const title = entry.querySelector('.news-tile-title')?.textContent || '';
            console.log(`Hiding: ${title}`);
        });
        
        // フィルタリングされた記事のみ表示
        const entriesToShow = filteredEntries.slice(startIndex, endIndex);
        console.log(`Showing entries from index ${startIndex} to ${endIndex} (${entriesToShow.length} items)`);
        
        entriesToShow.forEach((entry, index) => {
            entry.style.setProperty('display', 'block', 'important');
            const title = entry.querySelector('.news-tile-title')?.textContent || '';
            console.log(`Showing (${startIndex + index}): ${title}`);
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
                newsContainer.style.display = '';  // デフォルトスタイルを使用
                // グリッド表示の場合、スタイルを再適用
                if (newsContainer.classList.contains('news-grid')) {
                    setTimeout(forceGridStyle, 10);
                }
            }
        }
        
        // 最後に、実際の表示状態を確認
        console.log('--- Final display state ---');
        let visibleCount = 0;
        newsEntries.forEach((entry, index) => {
            // getComputedStyleを使用して実際の表示状態を確認
            const computedStyle = window.getComputedStyle(entry);
            const isVisible = computedStyle.display !== 'none';
            if (isVisible) {
                const title = entry.querySelector('.news-tile-title')?.textContent || '';
                console.log(`Visible entry ${visibleCount}: ${title}`);
                visibleCount++;
            }
        });
        console.log(`Total visible entries: ${visibleCount}`);
    }
    
    // イベントリスナー
    if (yearFilter) {
        console.log('Category Filter: Adding change event listener to yearFilter');
        yearFilter.addEventListener('change', filterNews);
    } else {
        console.log('Category Filter: WARNING - yearFilter element not found!');
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
    
    // 初期表示
    displayNews();
});