document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了');
    
    // メールアドレスの保護（ボット対策）
    const emailLink = document.getElementById('email-link');
    const emailDisplay = document.getElementById('email-display');
    
    if (emailLink && emailDisplay) {
        // データ属性からメールアドレスを構築
        const name = emailLink.getAttribute('data-name');
        const domain = emailLink.getAttribute('data-domain');
        
        if (name && domain) {
            const email = name + '@' + domain;
            
            // クリック時にメールアドレスを表示
            emailLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 既に表示されている場合はメールクライアントを開く
                if (this.getAttribute('href') !== '#') {
                    window.location.href = this.getAttribute('href');
                    return;
                }
                
                // メールアドレスを表示
                emailDisplay.textContent = email;
                this.setAttribute('href', 'mailto:' + email);
                
                // スタイルを少し変更して表示されたことを明確にする
                this.style.textDecoration = 'none';
                emailDisplay.style.borderBottom = '1px dashed var(--primary-terra)';
            });
            
            // ホバー時のヒント
            emailLink.setAttribute('title', 'クリックしてメールアドレスを表示');
        }
    }

    // モバイルメニューのトグル機能
    setTimeout(() => {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-nav');
        
        console.log('メニュー要素の確認:', {
            mobileMenuToggle: mobileMenuToggle,
            mainNav: mainNav,
            mobileMenuToggleDisplay: mobileMenuToggle ? window.getComputedStyle(mobileMenuToggle).display : 'null',
            mainNavDisplay: mainNav ? window.getComputedStyle(mainNav).display : 'null'
        });
        
        if (mobileMenuToggle && mainNav) {
            // メニューの開閉を処理する関数
            const toggleMenu = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                console.log('メニューボタンクリック！');
                console.log('mainNav classes before:', mainNav.className);
                console.log('mainNav computed style before:', window.getComputedStyle(mainNav).transform);
                
                mainNav.classList.toggle('active');
                
                console.log('mainNav classes after:', mainNav.className);
                console.log('mainNav computed style after:', window.getComputedStyle(mainNav).transform);
                
                // アイコンの切り替え
                const icon = mobileMenuToggle.querySelector('i');
                if (mainNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    mobileMenuToggle.setAttribute('aria-label', 'メニューを閉じる');
                    // アクセシビリティのための設定
                    mainNav.setAttribute('aria-hidden', 'false');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    mobileMenuToggle.setAttribute('aria-label', 'メニューを開く');
                    // アクセシビリティのための設定
                    mainNav.setAttribute('aria-hidden', 'true');
                }
            };
            
            // クリックイベント（デスクトップとモバイル両方に対応）
            mobileMenuToggle.addEventListener('click', toggleMenu, { passive: false });
            
            // タッチイベントのサポート（モバイルデバイス専用）
            let touchStarted = false;
            mobileMenuToggle.addEventListener('touchstart', function(e) {
                touchStarted = true;
                // タッチ開始時にデフォルトの動作を防ぐ
                e.preventDefault();
            }, { passive: false });
            
            mobileMenuToggle.addEventListener('touchend', function(e) {
                if (touchStarted) {
                    e.preventDefault();
                    toggleMenu(e);
                    touchStarted = false;
                }
            }, { passive: false });
            
            // タッチキャンセル時の処理
            mobileMenuToggle.addEventListener('touchcancel', function() {
                touchStarted = false;
            }, { passive: true });
            
            // メニュー外クリックで閉じる
            document.addEventListener('click', function(e) {
                if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    mobileMenuToggle.setAttribute('aria-label', 'メニューを開く');
                }
            });
            
            // リンククリック時にメニューを閉じる
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    mobileMenuToggle.setAttribute('aria-label', 'メニューを開く');
                });
            });
        } else {
            console.error('メニュー要素が見つかりません');
        }
    }, 100);

    // 動画のループ再生を確実にする
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // loop属性を再設定
        heroVideo.loop = true;
        
        // 動画が終了したときに最初から再生する（フォールバック）
        heroVideo.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        });
        
        // 動画の読み込みエラー時の処理
        heroVideo.addEventListener('error', function(e) {
            console.error('動画の読み込みエラー:', e);
        });
    }

    // ヘッダーのスクロール効果
    const header = document.getElementById('site-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // スクロール方向検知（オプション）
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // フェードインアニメーション（改良版）
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // 順次表示
            }
        });
    }, observerOptions);

    // フェードイン要素を監視
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // カード要素のホバーエフェクト
    const cards = document.querySelectorAll('.card, .topic-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // アクティブナビゲーションの設定
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // 完全一致またはサブページの場合もアクティブにする
        if (linkHref === currentPath || 
            (linkHref !== '/' && currentPath.startsWith(linkHref))) {
            link.classList.add('active');
        }
    });

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 統計数値のカウントアップアニメーション
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = target.textContent;
                const number = parseInt(value.replace(/\D/g, ''));
                const suffix = value.replace(/[0-9]/g, '');
                let current = 0;
                
                const increment = number / 50; // 50ステップでカウント
                
                const updateCounter = () => {
                    current += increment;
                    if (current < number) {
                        target.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = value;
                    }
                };
                
                updateCounter();
                statsObserver.unobserve(target);
            }
        });
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // タグのクリックイベント
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Tag clicked:', this.textContent);
            // タグフィルタリング機能を実装可能
        });
    });

    // 最終更新日の自動更新
    const lastModified = new Date(document.lastModified);
    const formattedDate = lastModified.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const updateElement = document.querySelector('.last-update');
    if (updateElement) {
        updateElement.textContent = `最終更新: ${formattedDate}`;
    }

    // パフォーマンス最適化: 画像の遅延読み込み
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ページトップへ戻るボタン（オプション）
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // ニュースの動的読み込み（ホームページ用）
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        // ニュースデータ（実際の実装では、JSONファイルから読み込むか、APIから取得）
        const allNews = [
            {
                date: '2024-02-14',
                title: 'PITタグを用いてニホンザリガニの移動を長期間調べた論文がHydrobiologia誌にアクセプトされました',
                excerpt: 'PITタグを用いたニホンザリガニの移動を調べた論文がHydrobiologia誌にアクセプトされました。 Makiguchi, Y., Iimura, Y., Nakao, K., Nii, H., Ueda, H., […]',
                thumbnail: '/img/2024-02-14-pit-tag-crayfish.png',
                link: '/news/pit-tag-crayfish-2024/'
            },
            {
                date: '2024-02-10',
                title: 'サケの繁殖行動の論文がEcology of Freshwater Fish誌にアクセプトされました',
                excerpt: '卒業生の関さんが主導したサケの繁殖行動に関する論文がEcology of Freshwater Fishにアクセプトされました。研究のタイトルは「Changes in courtship prior to oviposi […]',
                thumbnail: '/img/2024-02-10-salmon-courtship.png',
                link: '/news/salmon-courtship-2024/'
            },
            {
                date: '2022-11-25',
                title: '半天然魚の幼魚は養殖魚に比べて代謝率が高い',
                excerpt: '研究成果のポイント ・サクラマス幼魚の代謝と遊泳能力を半天然魚と養殖魚で比較した。 ・安静時代謝、最大遊泳能力代謝および遊泳効率が最大になる速度が半天然魚で高かった。 ・半天然魚の代謝が養殖魚のそれよりも高いという結果は […]',
                thumbnail: '/img/2022-11-25-semi-natural-metabolism.png',
                link: '/news/semi-natural-metabolism-2022/'
            },
            {
                date: '2022-04-04',
                title: '准教授へ昇格しました',
                excerpt: '日本大学 生物資源科学部 海洋生物学科 准教授へ昇格しました。',
                thumbnail: '/img/2022-04-04-promotion-associate-professor.png',
                link: '/news/promotion-2022/'
            },
            {
                date: '2021-03-16',
                title: '遊泳しているマス（サケ科魚類）の脳内から神経細胞活動を無線で計測する手法を開発',
                excerpt: '研究成果のポイント・遊泳するサケ科魚類の脳内から無線で神経細胞活動を計測する手法を開発・ マス（サケ科魚類）の終脳には頭が向いている方向に反応する細胞が存在する 公表雑誌：Animal Biotelemetry (202 […]',
                thumbnail: '/img/2021-03-16-wireless-neural.png',
                link: '/news/wireless-neural-2021/'
            }
        ];

        // 最新5件のニュースを表示
        const latestNews = allNews.slice(0, 5);
        
        latestNews.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item-with-thumbnail';
            newsItem.innerHTML = `
                <img src="${news.thumbnail}" alt="${news.title}" class="news-thumbnail" onerror="this.src='/img/news-default.jpg'">
                <div class="news-content">
                    <h2><a href="${news.link}">${news.title}</a></h2>
                    <div class="news-meta">
                        <time>${news.date}</time>
                    </div>
                    <p>${news.excerpt}</p>
                </div>
            `;
            newsContainer.appendChild(newsItem);
        });

        // アーカイブ機能の実装（将来的にはサーバーサイドで処理）
        const archiveNews = allNews.slice(5);
        if (archiveNews.length > 0) {
            sessionStorage.setItem('archivedNews', JSON.stringify(archiveNews));
        }
    }

    // 動画の研究リンクの表示制御
    const videoResearchLink = document.querySelector('.video-research-link');
    if (videoResearchLink) {
        // ローカルストレージから訪問状態を確認
        const linkVisited = localStorage.getItem('videoResearchLinkClicked');
        
        // 既にクリックされている場合は非表示
        if (linkVisited === 'true') {
            videoResearchLink.style.display = 'none';
        }
        
        // クリックイベントを追加
        videoResearchLink.addEventListener('click', function(e) {
            // クリックされたことを記録
            localStorage.setItem('videoResearchLinkClicked', 'true');
            
            // リンク先に遷移する前に、少し待ってから非表示にする
            setTimeout(() => {
                this.style.display = 'none';
            }, 100);
        });
    }

    // ニュース一覧ページの機能
    // この機能はnews-list.jsに移行したため無効化
    const initializeNewsPage = () => {
        return; // 無効化
        /*
        // ニュースデータを準備（実際にはHTMLから取得）
        const newsItems = document.querySelectorAll('.list-item');
        const newsContainer = document.querySelector('.card');
        
        if (!newsItems.length || !newsContainer) return;
        
        // フィルターとビュー切り替えのUIを追加
        const filtersHTML = `
            <div class="news-filters">
                <div class="filter-group">
                    <span class="filter-label">カテゴリー：</span>
                    <button class="filter-button active" data-category="all">すべて</button>
                    <button class="filter-button" data-category="論文">論文</button>
                    <button class="filter-button" data-category="研究成果">研究成果</button>
                    <button class="filter-button" data-category="お知らせ">お知らせ</button>
                    <button class="filter-button" data-category="技術開発">技術開発</button>
                </div>
                <div class="view-switcher">
                    <button class="view-button active" data-view="grid">
                        <i class="fas fa-th"></i>
                        グリッド
                    </button>
                    <button class="view-button" data-view="timeline">
                        <i class="fas fa-stream"></i>
                        タイムライン
                    </button>
                </div>
            </div>
        `;
        
        // ニュース一覧を囲むコンテナを追加
        const newsListContainer = document.createElement('div');
        newsListContainer.className = 'news-list-container news-grid';
        
        // 既存のニュースアイテムを新しいコンテナに移動
        newsItems.forEach(item => {
            newsListContainer.appendChild(item);
        });
        
        // ページネーションのHTML
        const paginationHTML = `
            <div class="news-pagination">
                <button class="pagination-button" data-page="prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-info">1 / 1</span>
                <button class="pagination-button" data-page="next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        // 年別アーカイブのHTML
        const archiveHTML = `
            <div class="news-archive">
                <h3 class="archive-title">
                    <i class="fas fa-calendar-alt"></i>
                    年別アーカイブ
                </h3>
                <div class="archive-years">
                    <div class="archive-year">
                        <button class="year-button" data-year="2024">
                            2024年
                            <span class="year-count">2</span>
                        </button>
                    </div>
                    <div class="archive-year">
                        <button class="year-button" data-year="2022">
                            2022年
                            <span class="year-count">2</span>
                        </button>
                    </div>
                    <div class="archive-year">
                        <button class="year-button" data-year="2021">
                            2021年
                            <span class="year-count">1</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // UIを挿入
        const h1 = newsContainer.querySelector('h1');
        h1.insertAdjacentHTML('afterend', filtersHTML);
        
        const filters = newsContainer.querySelector('.news-filters');
        filters.insertAdjacentElement('afterend', newsListContainer);
        
        newsListContainer.insertAdjacentHTML('afterend', paginationHTML);
        newsContainer.insertAdjacentHTML('beforeend', archiveHTML);
        
        // イベントリスナーを追加
        setupNewsFilters(newsItems);
        setupViewSwitcher(newsListContainer);
        setupPagination(newsItems);
        setupYearFilter(newsItems);
    };
    */
    };
    
    // 以下の関数もnews-list.jsに移行したため無効化
    /*
    
    // カテゴリーフィルター機能
    const setupNewsFilters = (newsItems) => {
        const filterButtons = document.querySelectorAll('.filter-button');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // アクティブクラスの切り替え
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                newsItems.forEach(item => {
                    if (category === 'all') {
                        item.style.display = '';
                    } else {
                        const categories = item.querySelectorAll('.category');
                        const hasCategory = Array.from(categories).some(cat => 
                            cat.textContent.trim() === category
                        );
                        item.style.display = hasCategory ? '' : 'none';
                    }
                });
                
                // ページネーションをリセット
                updatePagination(1);
            });
        });
    };
    
    // ビュー切り替え機能
    const setupViewSwitcher = (container) => {
        const viewButtons = document.querySelectorAll('.view-button');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const view = this.getAttribute('data-view');
                
                if (view === 'grid') {
                    container.classList.remove('news-timeline');
                    container.classList.add('news-grid');
                } else if (view === 'timeline') {
                    container.classList.remove('news-grid');
                    container.classList.add('news-timeline');
                    
                    // タイムラインビュー用のマーカーを追加
                    container.querySelectorAll('.list-item').forEach(item => {
                        if (!item.querySelector('.timeline-marker')) {
                            const marker = document.createElement('div');
                            marker.className = 'timeline-marker';
                            item.classList.add('timeline-item');
                            item.insertBefore(marker, item.firstChild);
                        }
                    });
                }
            });
        });
    };
    
    // ページネーション機能
    const setupPagination = (newsItems) => {
        const itemsPerPage = 6;
        let currentPage = 1;
        
        const updatePagination = (page) => {
            const visibleItems = Array.from(newsItems).filter(item => 
                item.style.display !== 'none'
            );
            const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
            
            // ページ番号の調整
            currentPage = Math.max(1, Math.min(page, totalPages));
            
            // アイテムの表示/非表示
            visibleItems.forEach((item, index) => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                item.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
            });
            
            // ページ情報の更新
            const pageInfo = document.querySelector('.pagination-info');
            pageInfo.textContent = `${currentPage} / ${totalPages}`;
            
            // ボタンの有効/無効
            const prevButton = document.querySelector('[data-page="prev"]');
            const nextButton = document.querySelector('[data-page="next"]');
            
            prevButton.classList.toggle('disabled', currentPage === 1);
            nextButton.classList.toggle('disabled', currentPage === totalPages);
        };
        
        // ページネーションボタンのクリックイベント
        document.querySelectorAll('.pagination-button').forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('disabled')) return;
                
                const action = this.getAttribute('data-page');
                if (action === 'prev') {
                    updatePagination(currentPage - 1);
                } else if (action === 'next') {
                    updatePagination(currentPage + 1);
                }
            });
        });
        
        // グローバルに公開
        window.updatePagination = updatePagination;
        
        // 初期表示
        updatePagination(1);
    };
    
    // 年別フィルター機能
    const setupYearFilter = (newsItems) => {
        const yearButtons = document.querySelectorAll('.year-button');
        
        yearButtons.forEach(button => {
            button.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                
                // すべてのフィルターをリセット
                document.querySelector('.filter-button[data-category="all"]').click();
                
                // 年でフィルタリング
                newsItems.forEach(item => {
                    const dateElement = item.querySelector('time');
                    if (dateElement) {
                        const itemYear = dateElement.textContent.split('年')[0];
                        item.style.display = itemYear === year ? '' : 'none';
                    }
                });
                
                // ページネーションをリセット
                updatePagination(1);
                
                // ページトップにスクロール
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    };
    */
    
    // ニュース一覧ページの機能
    // この機能はnews-list.jsに移行したため無効化
    /*
    if (window.location.pathname.includes('/news/')) {
        initializeNewsPage();
    }
    */

    // コンソールメッセージ
    console.log('%c🐟 Welcome to Makiguchi Lab! 🐟', 'color: #6B8E5C; font-size: 16px; font-weight: bold;');
    console.log('Researching salmonid behavior with bio-logging technology');
    
    // 開発者用：動画リンクの表示をリセットする関数
    window.resetVideoLink = function() {
        localStorage.removeItem('videoResearchLinkClicked');
        const link = document.querySelector('.video-research-link');
        if (link) {
            link.style.display = '';
            console.log('動画リンクの表示をリセットしました');
        }
    };
    console.log('動画リンクをリセットするには、コンソールで resetVideoLink() を実行してください');
    
    // 各大分類の論文を古いものから数え、最新の番号を最大にする
    const updatePublicationNumbers = () => {
        const publicationsContent = document.querySelector('.content-section .article-content');
        if (!publicationsContent || !window.location.pathname.includes('publications')) {
            return;
        }

        let sectionItems = [];
        const applyNumbers = () => {
            const itemCount = sectionItems.length;
            sectionItems.forEach((item, index) => {
                item.setAttribute('data-publication-number', (itemCount - index).toString().padStart(2, '0'));
            });
        };

        Array.from(publicationsContent.children).forEach(element => {
            if (element.tagName === 'H2') {
                applyNumbers();
                sectionItems = [];
            } else if (element.classList.contains('publication-item')) {
                sectionItems.push(element);
            }
        });
        applyNumbers();
    };

    // 論文リストの番号付け管理機能
    const initializePublications = () => {
        // 論文ページでのみ実行
        const publicationsPage = document.querySelector('.content-section');
        if (!publicationsPage || !window.location.pathname.includes('publications')) {
            return;
        }
        
        updatePublicationNumbers();

        // 論文アイテムの番号を保護（スタイルは変更しない）
        const publicationItems = document.querySelectorAll('.publication-item');
        publicationItems.forEach(item => {
            // ::before要素と::after要素のスタイルを保護
            // CSSで!importantを使用しているため、JavaScriptからの変更は無効になる
            item.setAttribute('data-before-protected', 'true');
            item.setAttribute('data-after-protected', 'true');
            
            // CSSクラスを追加して、スタイルの保護を強化
            item.classList.add('publication-item-protected');
        });
    };
    
    // 番号の整合性を保つ関数（スタイルは変更しない）
    const maintainPublicationNumbers = () => {
        const section = document.querySelector('.content-section');
        if (!section || !window.location.pathname.includes('publications')) {
            return;
        }
        
        updatePublicationNumbers();
    };
    
    // 初期化時に実行
    initializePublications();
    
    // MutationObserverで論文リストの変更を監視（改良版）
    const publicationsSection = document.querySelector('.content-section');
    if (publicationsSection && window.location.pathname.includes('publications')) {
        let updateTimeout = null;
        
        const observer = new MutationObserver((mutations) => {
            // タイマーをクリアして重複実行を防ぐ
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            
            // 変更があった場合のみ更新
            let hasRelevantChanges = false;
            mutations.forEach(mutation => {
                // 論文アイテムに関する変更のみを検出
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const removedNodes = Array.from(mutation.removedNodes);
                    
                    // 論文アイテムの追加・削除を確認
                    const hasPublicationChanges = 
                        addedNodes.some(node => node.classList && node.classList.contains('publication-item')) ||
                        removedNodes.some(node => node.classList && node.classList.contains('publication-item')) ||
                        (mutation.target.classList && mutation.target.classList.contains('publication-item'));
                    
                    if (hasPublicationChanges) {
                        hasRelevantChanges = true;
                    }
                }
            });
            
            if (hasRelevantChanges) {
                // 少し遅延を入れてDOMの更新を待つ
                updateTimeout = setTimeout(() => {
                    maintainPublicationNumbers();
                }, 100);
            }
        });
        
        observer.observe(publicationsSection, {
            childList: true,
            subtree: true,
            attributes: false, // スタイル属性の監視は不要
            characterData: false
        });
    }
    
    // 追加のデバッグコード（モバイルメニュー用）
    console.log('Main.js loaded successfully');
});
