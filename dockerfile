FROM php:8.2-apache

# Instala extensiones necesarias y utilidades
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    libzip-dev zip unzip \
    && docker-php-ext-install mysqli pdo pdo_mysql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copia archivos (también montaremos como volumen en docker-compose para desarrollo)
COPY . /var/www/html

# Permisos básicos
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \;

EXPOSE 80

CMD ["apache2-foreground"]

