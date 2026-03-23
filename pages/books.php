
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Книги-Моя библиотека</title>
    <link rel="stylesheet" href="font-awesome/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Основной интерфейс после авторизации -->
    <div class="app-container" id="app-interface">
        <!-- Шапка -->
        <header class="app-header">
            <div class="header-content">
                <div class="logo">
                    <i class="fas fa-book-open"></i>
                    <h1>Моя библиотека</h1>
                </div>
                <nav class="main-nav">
                    <ul>
                        <li class="active"><a href="books.php"><i class="fas fa-home"></i> Главная</a></li>
                        <li><a href="add_book.php"><i class="fas fa-plus"></i> Добавить книгу</a></li>
                        <li><a href="../php/logout.php" id="logout-btn"><i class="fas fa-sign-out-alt"></i>Выход</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        <!-- Основное содержимое -->
        <main class="main-content">
            <div class="container">
                <!-- Панель управления -->
                <div class="control-panel">
                    <form action="books.php" method="post">
                        <div class="search-box">
                            <input type="text" placeholder="Поиск по названию..." name="search">
                            <button type="submit" class="btn btn-search"><i class="fas fa-search"></i>Найти</button>
                        </div>
                    </form>
                    <div class="filters">
                        <form action="books.php" class="row g-2" method="post">
                            <select class="form-control" name='search_genre'>
                            <option value="0">Выберите жанр</option>
                            <option value="1">Фантастика</option>
                            <option value="2">Классика</option>
                            <option value="3">Детектив</option>
                            <option value="4">Роман</option>
                            <option value="5">Научная литература</option>
                            <option value="6">Биография</option>
                            </select>
                            <button class="btn btn-primary">Выбрать</button>
                        </form>
                        <form action="books.php" class="row g-2"  method="post">
                            <select class="form-control" name="alpha">
                                <option value="ASC">По названию (А-Я)</option>
                                <option value="DESC">По названию (Я-А)</option>
                            </select>
                            <button class="btn btn-primary" >Сортировать</button>
                        </form>                        
                    </div>
                </div>
                <!-- Список книг -->
                <div class="books-list">
                    <?php foreach($result as $current): ?>
                    <div class="book-card">
                        <div class="book-cover">
                            <img src="img/test.jpg" alt="Обложка книги">
                            <a href="book.html"></a>
                        </div>
                        <div class="book-info">
                            <h3 class="book-title"><a href="book.html"><?php echo($current['name']); ?></a></h3>
                            <p class="book-author"><?php echo($authors->get_name($current['author_id']))?></p>
                            <div class="book-meta">
                                <span class="book-year"><i class="fas fa-calendar-alt"></i> 
                                <?php echo($current['year_of_publication']); ?>
                            </span>
                                <span class="book-genre"><i class="fas fa-tag"></i> 
                                <?php
                                $sql = 'SELECT name FROM genres WHERE id = :id';
                                $stmt = $pdo->prepare($sql);
                                $stmt->execute(['id' => $current['genre_id']]);
                                $genre = $stmt->fetch(PDO::FETCH_ASSOC)['name'];
                                echo($genre); ?>
                                </span>
                            </div>
                            <div class="book-actions">
                                <a <?php echo("href=book.php?id=" . $current['id']) ?> class="btn btn-view"><i class="fas fa-eye"></i></a>
                                <a <?php echo("href=edit_book.php?id=" . $current['id']) ?> class="btn btn-edit"><i class="fas fa-edit"></i></a>
                                <a <?php echo("href=delete_book.php?id=" . $current['id']) ?> class="btn btn-delete"><i class="fas fa-trash"></i></a>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <!-- Пагинация -->
                <div class="pagination">
                    <a class="btn btn-pagination" href="../php/left.php"><i class="fas fa-chevron-left"></i></a>
                    <?php for($i = 1; $i <= (int)(count($all) / 3) + 1; $i++){
                        echo('<a class="btn btn-pagination active" href="../php/change.php?n=' . $i . '">' . $i . '</a>');
                    }
                    ?>
                    <a class="btn btn-pagination" href="../php/right.php"><i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        </main>
    </div>
</body>
</html>