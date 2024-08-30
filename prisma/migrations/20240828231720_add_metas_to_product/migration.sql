-- CreateTable
CREATE TABLE `abouts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title_review` VARCHAR(255) NULL,
    `review` LONGTEXT NULL,
    `view` LONGTEXT NULL,
    `mission` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alliances` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `website` TEXT NULL,
    `image` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `footer_image` VARCHAR(255) NULL DEFAULT '0',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `extension` VARCHAR(255) NOT NULL,
    `product_id` BIGINT NULL,
    `name_id` BIGINT NULL,
    `subscription_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `attachments_subscription_id_foreign`(`subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `file` TEXT NOT NULL,
    `alt` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `button_title` VARCHAR(255) NULL,
    `size` VARCHAR(255) NULL,
    `location` VARCHAR(255) NULL,
    `button_target` VARCHAR(255) NOT NULL DEFAULT '_SELF',
    `button_link` VARCHAR(255) NULL DEFAULT '#',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `position` BOOLEAN NOT NULL DEFAULT false,
    `cms_slider_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `responsive_file` VARCHAR(255) NULL,

    INDEX `banners_cms_slider_id_foreign`(`cms_slider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bills` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `sheet_number` BIGINT NOT NULL,
    `date_bill` DATE NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `total` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `bills_customer_id_foreign`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `url` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `image` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `image` TEXT NULL,
    `banner_image` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `description` TEXT NULL,
    `subbanner_image` TEXT NULL,
    `quantity_limit` INTEGER NOT NULL DEFAULT 1,
    `position_banner` INTEGER NOT NULL DEFAULT 99,
    `banner_image_size` VARCHAR(255) NOT NULL DEFAULT 'col-md-12',
    `subbanner_image_size` VARCHAR(255) NOT NULL DEFAULT 'col-md-12',
    `unit_format` TEXT NULL,
    `banner_image_responsive` TEXT NULL,
    `banner_subimage_responsive` TEXT NULL,
    `active_banner_home` BOOLEAN NOT NULL DEFAULT true,
    `active_footer` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_faqs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `position` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `claims` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone_code` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `contact_issue_id` BIGINT UNSIGNED NULL,
    `order_id` BIGINT UNSIGNED NULL,
    `message` TEXT NULL,
    `is_reply` BOOLEAN NOT NULL DEFAULT false,
    `reply` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `claims_contact_issue_id_foreign`(`contact_issue_id`),
    INDEX `claims_order_id_foreign`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cms_sliders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `communes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `province_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `communes_province_id_foreign`(`province_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_issues` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `type` ENUM('Reclamos', 'Sugerencias', 'Otros') NULL,
    `section` ENUM('Servicio al Cliente', 'Contáctanos') NULL,
    `campaign_id` BIGINT UNSIGNED NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `contact_issues_campaign_id_foreign`(`campaign_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone_code` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `contact_issue_id` BIGINT UNSIGNED NULL,
    `order_id` BIGINT UNSIGNED NULL,
    `message` TEXT NULL,
    `is_reply` BOOLEAN NOT NULL DEFAULT false,
    `reply` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `nested_fields` TEXT NULL,
    `dynamic_fields` LONGTEXT NULL,
    `customer_id` BIGINT UNSIGNED NULL,

    INDEX `contacts_contact_issue_id_foreign`(`contact_issue_id`),
    INDEX `contacts_customer_id_foreign`(`customer_id`),
    INDEX `contacts_order_id_foreign`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_addresses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `address` VARCHAR(255) NOT NULL,
    `extra_info` VARCHAR(255) NULL,
    `customer_id` BIGINT UNSIGNED NULL,
    `region_id` BIGINT UNSIGNED NULL,
    `commune_id` BIGINT UNSIGNED NULL,
    `default_address` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `comment` TEXT NULL,

    INDEX `customer_addresses_commune_id_foreign`(`commune_id`),
    INDEX `customer_addresses_customer_id_foreign`(`customer_id`),
    INDEX `customer_addresses_region_id_foreign`(`region_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_number` VARCHAR(255) NULL,
    `id_type` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `second_last_name` VARCHAR(255) NULL,
    `phone_code` VARCHAR(15) NULL,
    `phone` VARCHAR(15) NULL,
    `email` VARCHAR(255) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `business_name` VARCHAR(255) NULL,
    `business_id_number` VARCHAR(255) NULL,
    `commercial_business` VARCHAR(255) NULL,
    `commercial_email` VARCHAR(255) NULL,
    `commercial_address` VARCHAR(255) NULL,
    `commercial_additional_address` VARCHAR(255) NULL,
    `commercial_phone` VARCHAR(255) NULL,
    `commercial_phone_code` VARCHAR(255) NULL,
    `commercial_region_id` BIGINT UNSIGNED NULL,
    `commercial_commune_id` BIGINT UNSIGNED NULL,
    `recovery_pin` VARCHAR(255) NULL,
    `last_access` DATETIME(0) NULL,
    `photo` TEXT NULL,
    `remember_token` VARCHAR(100) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `is_guest` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `customers_id_number_unique`(`id_number`),
    INDEX `customers_commercial_commune_id_foreign`(`commercial_commune_id`),
    INDEX `customers_commercial_region_id_foreign`(`commercial_region_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `day_payments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url_pdf` VARCHAR(255) NULL,
    `total` DOUBLE NOT NULL DEFAULT 0.00,
    `payment_commission_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `date_payment` DATE NULL,
    `number` TEXT NULL,
    `orders` TEXT NULL,

    INDEX `day_payments_payment_commission_id_foreign`(`payment_commission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_costs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `image` TEXT NULL,
    `deadline_delivery` INTEGER NULL,
    `costs` TEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deadline_delivery_llego` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_labels` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `label_original` VARCHAR(255) NULL,
    `key` VARCHAR(255) NOT NULL,
    `label_custom` VARCHAR(255) NULL,
    `color` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `sub_label` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount_codes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `discount` DOUBLE NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `expiration_date` DATETIME(0) NULL,
    `is_forever` BOOLEAN NOT NULL DEFAULT false,
    `is_percentage` BOOLEAN NOT NULL DEFAULT false,
    `amount_of_use` INTEGER NULL,
    `customer_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `free_shipping` BOOLEAN NOT NULL DEFAULT false,

    INDEX `discount_codes_customer_id_foreign`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dynamic_fields` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `type` ENUM('input', 'textarea', 'select', 'radio', 'checkbox') NOT NULL DEFAULT 'input',
    `values` TEXT NULL,
    `contact_issue_id` BIGINT UNSIGNED NULL,
    `section` ENUM('campaña', 'asunto') NOT NULL DEFAULT 'campaña',
    `parent_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `dynamic_fields_contact_issue_id_foreign`(`contact_issue_id`),
    INDEX `dynamic_fields_parent_id_foreign`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(255) NOT NULL,
    `answer` LONGTEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,
    `category_faq_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `faqs_category_faq_id_foreign`(`category_faq_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `free_dispatch_products` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `products` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,
    `imageable_id` BIGINT NOT NULL,
    `imageable_type` VARCHAR(255) NOT NULL,
    `alt` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `queue` VARCHAR(255) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL,
    `reserved_at` INTEGER UNSIGNED NULL,
    `available_at` INTEGER UNSIGNED NOT NULL,
    `created_at` INTEGER UNSIGNED NOT NULL,

    INDEX `jobs_queue_index`(`queue`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laboratories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `corporate_name` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `legal_bases` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `file` TEXT NULL,
    `icon` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `legal_warnings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_has_permissions` (
    `permission_id` INTEGER UNSIGNED NOT NULL,
    `model_type` VARCHAR(255) NOT NULL,
    `model_id` BIGINT UNSIGNED NOT NULL,

    INDEX `model_has_permissions_model_id_model_type_index`(`model_id`, `model_type`),
    PRIMARY KEY (`permission_id`, `model_id`, `model_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_has_roles` (
    `role_id` INTEGER UNSIGNED NOT NULL,
    `model_type` VARCHAR(255) NOT NULL,
    `model_id` BIGINT UNSIGNED NOT NULL,

    INDEX `model_has_roles_model_id_model_type_index`(`model_id`, `model_type`),
    PRIMARY KEY (`role_id`, `model_id`, `model_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nested_field_questions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,
    `nested_field_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `nested_field_questions_nested_field_id_foreign`(`nested_field_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nested_fields` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `group_title` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,
    `parent_id` BIGINT UNSIGNED NULL,
    `campaign_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `contact_issue_id` BIGINT UNSIGNED NULL,
    `section` ENUM('campania', 'contacto') NOT NULL DEFAULT 'contacto',

    INDEX `nested_fields_campaign_id_foreign`(`campaign_id`),
    INDEX `nested_fields_contact_issue_id_foreign`(`contact_issue_id`),
    INDEX `nested_fields_parent_id_foreign`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletters` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_access_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_access_tokens_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_auth_codes` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_auth_codes_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `secret` VARCHAR(100) NULL,
    `provider` VARCHAR(255) NULL,
    `redirect` TEXT NOT NULL,
    `personal_access_client` BOOLEAN NOT NULL,
    `password_client` BOOLEAN NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `oauth_clients_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_personal_access_clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_refresh_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `access_token_id` VARCHAR(100) NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_refresh_tokens_access_token_id_index`(`access_token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT UNSIGNED NULL,
    `product_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `subscription_plan_id` BIGINT UNSIGNED NULL,
    `product_attributes` VARCHAR(255) NULL,
    `extra_price` DOUBLE NULL,
    `extra_description` TEXT NULL,
    `subtotal` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `order_items_order_id_foreign`(`order_id`),
    INDEX `order_items_product_id_foreign`(`product_id`),
    INDEX `order_items_subscription_plan_id_foreign`(`subscription_plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_id` BIGINT UNSIGNED NULL,
    `delivery_address` LONGTEXT NULL,
    `subtotal` DOUBLE NOT NULL DEFAULT 0.00,
    `discount` DOUBLE NOT NULL DEFAULT 0.00,
    `dispatch` DOUBLE NOT NULL DEFAULT 0.00,
    `total` DOUBLE NOT NULL DEFAULT 0.00,
    `payment_type` VARCHAR(255) NULL,
    `payment_token` VARCHAR(255) NULL,
    `payment_date` DATETIME(0) NULL,
    `is_paid` BOOLEAN NOT NULL DEFAULT false,
    `is_email` BOOLEAN NOT NULL DEFAULT false,
    `is_billed` BOOLEAN NOT NULL DEFAULT false,
    `billing_date` DATETIME(0) NULL,
    `billing_receipt` TEXT NULL,
    `delivery_date` DATETIME(0) NULL,
    `comments` TEXT NULL,
    `extra_data` LONGTEXT NULL,
    `status` ENUM('CREATED', 'CANCELED', 'DISPATCHED', 'REJECTED', 'DELIVERED', 'PAID') NOT NULL DEFAULT 'CREATED',
    `discount_code_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `document_type` VARCHAR(255) NULL,
    `shipping_type` VARCHAR(255) NULL,
    `prescription_validation` BOOLEAN NOT NULL DEFAULT false,
    `humidity` DOUBLE NOT NULL DEFAULT 0.00,
    `temperature` DOUBLE NOT NULL DEFAULT 0.00,
    `voucher_pdf` TEXT NULL,
    `dispatch_status` VARCHAR(255) NULL,
    `prescription_answer` TEXT NULL,
    `is_immediate` BOOLEAN NOT NULL DEFAULT false,
    `label_dispatch` VARCHAR(255) NULL,
    `dispatch_date` DATETIME(0) NULL,
    `house_number` VARCHAR(255) NULL,
    `ballot_number` VARCHAR(255) NULL,
    `region` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,
    `billing_number` TEXT NULL,

    INDEX `orders_customer_id_foreign`(`customer_id`),
    INDEX `orders_discount_code_id_foreign`(`discount_code_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `section` ENUM('Responsabilidad Empresarial', 'Términos y Condiciones') NOT NULL DEFAULT 'Términos y Condiciones',
    `type` ENUM('Página Externa', 'Página Propia') NOT NULL DEFAULT 'Página Propia',
    `description` LONGTEXT NULL,
    `link` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `password_resets_email_index`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_commissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(0) NULL,
    `end_date` DATETIME(0) NULL,
    `commission` DOUBLE NOT NULL DEFAULT 0.00,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `public_name` VARCHAR(255) NULL,
    `public_group` VARCHAR(255) NULL,
    `public_description` TEXT NULL,
    `guard_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_types` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `image` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `post_types_slug_unique`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NULL,
    `principal_image` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `author_id` BIGINT UNSIGNED NULL,
    `post_type_id` BIGINT UNSIGNED NULL,
    `published_at` DATE NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `link` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL DEFAULT 'Imagen',
    `visits` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `posts_slug_unique`(`slug`),
    INDEX `posts_author_id_foreign`(`author_id`),
    INDEX `posts_post_type_id_foreign`(`post_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescriptions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `file` VARCHAR(255) NOT NULL,
    `customer_id` BIGINT UNSIGNED NULL,
    `product_id` BIGINT UNSIGNED NULL,
    `order_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `prescriptions_customer_id_foreign`(`customer_id`),
    INDEX `prescriptions_order_id_foreign`(`order_id`),
    INDEX `prescriptions_product_id_foreign`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prices` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `price` INTEGER NOT NULL,
    `until` DATE NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `subscription_plan_id` BIGINT UNSIGNED NOT NULL,
    `quantity` TEXT NULL,

    INDEX `prices_product_id_foreign`(`product_id`),
    INDEX `prices_subscription_plan_id_foreign`(`subscription_plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `file` VARCHAR(255) NULL,
    `position` INTEGER NULL,
    `product_id` BIGINT UNSIGNED NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `product_images_product_id_foreign`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_schedules` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,
    `day_of_week` INTEGER NOT NULL,
    `type` ENUM('IMMEDIATE', 'NORMAL') NOT NULL DEFAULT 'NORMAL',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_subscription_plan` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `warnings` LONGTEXT NULL,
    `product_id` BIGINT UNSIGNED NULL,
    `subscription_plan_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `price` INTEGER NULL,
    `quantity` INTEGER NULL DEFAULT 2,
    `days` INTEGER NOT NULL DEFAULT 28,
    `position` INTEGER NULL DEFAULT 0,
    `image` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `product_subscription_plan_product_id_foreign`(`product_id`),
    INDEX `product_subscription_plan_subscription_plan_id_foreign`(`subscription_plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `slug` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `compound` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `is_offer` BOOLEAN NOT NULL DEFAULT false,
    `is_bioequivalent` BOOLEAN NOT NULL DEFAULT false,
    `consumption_typology` ENUM('ABA - ORAL S.ORD.GRAGEAS', 'AAA - ORAL S.ORD. TABLETAS', 'TYQ - VAGINAL PESARIO MEC C/S', 'JWN - OTROS SIST.EMPL TRANSDER', 'GMD - PARENT.RET.AMP I.M.', 'ABC - ORAL S.ORD.GRAG.RECUB.', 'GNE - PARENT.RET. JER PREC SC', 'GND - PARENT.RET.JER.PRECAR.IM', 'TYR - VAGINAL D.I.U.', 'TVA - VAGINAL GEL/SOL', 'TTA - VAGINAL CREMA NO ESPEC.', 'TGW - VAGINAL JAB LIQD/LAV', 'ACA - ORAL S.ORD.CAPSULAS', 'TLS - VAGINAL SUPOSITORIOS', 'TGS - VAGINAL LOCIONES', 'DEP - ORAL LIQ.ORD.POLVO DOSIS', 'GPD - PARENT.RET.VIALES I.M.', 'TWY - VAGINAL OTR APOSIT MEDIC', 'FMA - PARENT.ORD.AMPOLLAS', 'DGA - ORAL LIQ.ORD.LIQUIDOS', 'GYV - PARENT.RET.INJERTO', 'DGB - ORAL LIQ.ORD.GOTAS', 'ADR - ORAL S.ORD.GLOB PQ+HOMEO') NOT NULL DEFAULT 'ABA - ORAL S.ORD.GRAGEAS',
    `price` DOUBLE NULL,
    `offer_price` DOUBLE NULL,
    `long` DOUBLE NULL,
    `height` DOUBLE NULL,
    `width` DOUBLE NULL,
    `weigth` DOUBLE NULL,
    `stock` INTEGER NULL,
    `laboratory_id` BIGINT UNSIGNED NULL,
    `subcategory_id` BIGINT UNSIGNED NULL,
    `benefits` LONGTEXT NULL,
    `data_sheet` LONGTEXT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `format` ENUM('1', '2', '3', '3.5', '4', '5', '6', '7', '8', '10', '12', '14', '15', '16', '20', '21', '24', '25', '28', '30', '35', '40', '45', '50', '56', '60', '80', '90', '91', '100', '133', '180', '200', '250') NULL,
    `barcode` TEXT NULL,
    `unit_format` TEXT NULL,
    `unit_price` INTEGER NULL,
    `recipe_type` TEXT NULL,
    `state_of_matter` ENUM('Solido', 'Liquido') NULL,
    `outstanding` BOOLEAN NOT NULL DEFAULT false,
    `product_item_id_ailoo` INTEGER NULL,
    `is_immediate` BOOLEAN NOT NULL DEFAULT false,
    `position` INTEGER NOT NULL DEFAULT 0,
    `is_medicine` BOOLEAN NOT NULL DEFAULT false,
    `is_indexable` BOOLEAN NOT NULL DEFAULT true,
    `is_requested` BOOLEAN NOT NULL DEFAULT false,
    `days_protection` INTEGER NULL,
    `is_generic` BOOLEAN NOT NULL DEFAULT false,
    `is_cenabast` BOOLEAN NOT NULL DEFAULT false,
    `cpp` DOUBLE NULL,
    `meta_title` TEXT NULL,
    `meta_description` TEXT NULL,

    INDEX `products_laboratory_id_foreign`(`laboratory_id`),
    INDEX `products_subcategory_id_foreign`(`subcategory_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provinces` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `region_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `provinces_region_id_foreign`(`region_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(4) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responsible_consumptions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `file` TEXT NULL,
    `image` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_has_permissions` (
    `permission_id` INTEGER UNSIGNED NOT NULL,
    `role_id` INTEGER UNSIGNED NOT NULL,

    INDEX `role_has_permissions_role_id_foreign`(`role_id`),
    PRIMARY KEY (`permission_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `guard_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_terms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `term` VARCHAR(255) NOT NULL,
    `results` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seo_panels` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `settings_key_unique`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subcategories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `category_id` BIGINT UNSIGNED NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `banner_image` TEXT NULL,
    `banner_image_responsive` TEXT NULL,
    `description` TEXT NULL,

    INDEX `subcategories_category_id_foreign`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_plans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `months` INTEGER NULL,
    `cicles` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_values` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `price` DOUBLE NULL,
    `start_date` DATE NULL,
    `due_date` DATE NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `card` TEXT NULL,
    `customer_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `transbank_token` VARCHAR(255) NULL,
    `oneclick_auth_code` VARCHAR(255) NULL,
    `card_type` VARCHAR(255) NULL,
    `card_number` VARCHAR(255) NULL,
    `token_inscription` TEXT NULL,
    `status` ENUM('CREATED', 'REJECTED', 'WAITING', 'CANCELED', 'PROCESSING') NOT NULL DEFAULT 'WAITING',
    `default_subscription` BOOLEAN NULL DEFAULT false,
    `from` VARCHAR(255) NULL,

    INDEX `subscriptions_customer_id_foreign`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions_orders_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `orders_item_id` BIGINT UNSIGNED NULL,
    `dispatch_date` DATETIME(0) NULL,
    `pay_date` DATETIME(0) NULL,
    `origin_pay_date` DATETIME(0) NULL,
    `is_pay` BOOLEAN NOT NULL DEFAULT false,
    `customer_address_id` BIGINT UNSIGNED NULL,
    `subscription_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `order_id` BIGINT UNSIGNED NULL,
    `status` ENUM('CREATED', 'PAID', 'REJECTED', 'DISPATCHED', 'DELIVERED') NOT NULL DEFAULT 'CREATED',
    `voucher_pdf` TEXT NULL,
    `dispatch_status` VARCHAR(255) NULL,
    `delivery_address` VARCHAR(255) NULL,
    `dispatch` DOUBLE NULL,
    `commune_id` BIGINT UNSIGNED NULL,
    `quantity` INTEGER NOT NULL DEFAULT 2,
    `order_parent_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NULL,
    `price` DOUBLE NULL,
    `subtotal` DOUBLE NULL,
    `period` VARCHAR(255) NULL,
    `days` INTEGER NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `payment_attempt` INTEGER NOT NULL DEFAULT 0,
    `free_shipping` BOOLEAN NOT NULL DEFAULT false,

    INDEX `subscriptions_orders_items_commune_id_foreign`(`commune_id`),
    INDEX `subscriptions_orders_items_customer_address_id_foreign`(`customer_address_id`),
    INDEX `subscriptions_orders_items_order_id_foreign`(`order_id`),
    INDEX `subscriptions_orders_items_order_parent_id_foreign_idx`(`order_parent_id`),
    INDEX `subscriptions_orders_items_orders_item_id_foreign`(`orders_item_id`),
    INDEX `subscriptions_orders_items_subscription_id_foreign`(`subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `text_headers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(255) NULL,
    `link` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timelines` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `icon` TEXT NULL,
    `year` VARCHAR(255) NULL,
    `post_id` BIGINT UNSIGNED NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `slug` VARCHAR(255) NULL,
    `position` INTEGER NULL DEFAULT 0,

    INDEX `timelines_post_id_foreign`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NULL,
    `rut` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `second_last_name` VARCHAR(255) NULL,
    `phone` VARCHAR(15) NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `recovery_pin` VARCHAR(255) NULL,
    `last_access` DATETIME(0) NULL,
    `avatar` TEXT NULL,
    `theme` VARCHAR(255) NOT NULL DEFAULT '/type-e/theme-ocean.min.css',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `editable` BOOLEAN NOT NULL DEFAULT true,
    `removable` BOOLEAN NOT NULL DEFAULT true,
    `viewable` BOOLEAN NOT NULL DEFAULT true,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_rut_unique`(`rut`),
    UNIQUE INDEX `users_phone_unique`(`phone`),
    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `values` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `image` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webpay_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT UNSIGNED NULL,
    `type` VARCHAR(255) NOT NULL,
    `accounting_date` VARCHAR(255) NULL,
    `buy_order` VARCHAR(255) NULL,
    `card_number` VARCHAR(255) NULL,
    `card_expiration_date` VARCHAR(255) NULL,
    `authorization_code` VARCHAR(255) NULL,
    `payment_type_code` VARCHAR(255) NULL,
    `response_code` VARCHAR(255) NULL,
    `shares_number` VARCHAR(255) NULL,
    `amount` VARCHAR(255) NULL,
    `commerce_code` VARCHAR(255) NULL,
    `session_id` VARCHAR(255) NULL,
    `transaction_date` VARCHAR(255) NULL,
    `url_redirection` VARCHAR(255) NULL,
    `vci` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `webpay_logs_order_id_foreign`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `price_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT UNSIGNED NULL,
    `price` DOUBLE NULL,
    `qty` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `price_logs_product_id_foreign`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cpp_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `price_log_id` BIGINT UNSIGNED NULL,
    `cpp` DOUBLE NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `cpp_logs_price_log_id_foreign`(`price_log_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_product` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `location_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `location_product_location_id_foreign`(`location_id`),
    INDEX `location_product_product_id_foreign`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `banners` ADD CONSTRAINT `banners_cms_slider_id_foreign` FOREIGN KEY (`cms_slider_id`) REFERENCES `cms_sliders`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bills` ADD CONSTRAINT `bills_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `claims` ADD CONSTRAINT `claims_contact_issue_id_foreign` FOREIGN KEY (`contact_issue_id`) REFERENCES `contact_issues`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `claims` ADD CONSTRAINT `claims_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `communes` ADD CONSTRAINT `communes_province_id_foreign` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_issues` ADD CONSTRAINT `contact_issues_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_contact_issue_id_foreign` FOREIGN KEY (`contact_issue_id`) REFERENCES `contact_issues`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customer_addresses` ADD CONSTRAINT `customer_addresses_commune_id_foreign` FOREIGN KEY (`commune_id`) REFERENCES `communes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customer_addresses` ADD CONSTRAINT `customer_addresses_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customer_addresses` ADD CONSTRAINT `customer_addresses_region_id_foreign` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_commercial_commune_id_foreign` FOREIGN KEY (`commercial_commune_id`) REFERENCES `communes`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_commercial_region_id_foreign` FOREIGN KEY (`commercial_region_id`) REFERENCES `regions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `day_payments` ADD CONSTRAINT `day_payments_payment_commission_id_foreign` FOREIGN KEY (`payment_commission_id`) REFERENCES `payment_commissions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `discount_codes` ADD CONSTRAINT `discount_codes_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dynamic_fields` ADD CONSTRAINT `dynamic_fields_contact_issue_id_foreign` FOREIGN KEY (`contact_issue_id`) REFERENCES `contact_issues`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dynamic_fields` ADD CONSTRAINT `dynamic_fields_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `dynamic_fields`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `faqs` ADD CONSTRAINT `faqs_category_faq_id_foreign` FOREIGN KEY (`category_faq_id`) REFERENCES `category_faqs`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model_has_permissions` ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model_has_roles` ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nested_field_questions` ADD CONSTRAINT `nested_field_questions_nested_field_id_foreign` FOREIGN KEY (`nested_field_id`) REFERENCES `nested_fields`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nested_fields` ADD CONSTRAINT `nested_fields_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nested_fields` ADD CONSTRAINT `nested_fields_contact_issue_id_foreign` FOREIGN KEY (`contact_issue_id`) REFERENCES `contact_issues`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nested_fields` ADD CONSTRAINT `nested_fields_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `nested_fields`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_subscription_plan_id_foreign` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_discount_code_id_foreign` FOREIGN KEY (`discount_code_id`) REFERENCES `discount_codes`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_post_type_id_foreign` FOREIGN KEY (`post_type_id`) REFERENCES `post_types`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_subscription_plan_id_foreign` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_subscription_plan` ADD CONSTRAINT `product_subscription_plan_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_subscription_plan` ADD CONSTRAINT `product_subscription_plan_subscription_plan_id_foreign` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_laboratory_id_foreign` FOREIGN KEY (`laboratory_id`) REFERENCES `laboratories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subcategory_id_foreign` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `provinces` ADD CONSTRAINT `provinces_region_id_foreign` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions_orders_items` ADD CONSTRAINT `subscriptions_orders_items_commune_id_foreign` FOREIGN KEY (`commune_id`) REFERENCES `communes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions_orders_items` ADD CONSTRAINT `subscriptions_orders_items_customer_address_id_foreign` FOREIGN KEY (`customer_address_id`) REFERENCES `customer_addresses`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions_orders_items` ADD CONSTRAINT `subscriptions_orders_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions_orders_items` ADD CONSTRAINT `subscriptions_orders_items_order_parent_id_foreign` FOREIGN KEY (`order_parent_id`) REFERENCES `orders`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions_orders_items` ADD CONSTRAINT `subscriptions_orders_items_orders_item_id_foreign` FOREIGN KEY (`orders_item_id`) REFERENCES `order_items`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `subscriptions_orders_items` ADD CONSTRAINT `subscriptions_orders_items_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `timelines` ADD CONSTRAINT `timelines_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `webpay_logs` ADD CONSTRAINT `webpay_logs_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `price_logs` ADD CONSTRAINT `price_logs_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cpp_logs` ADD CONSTRAINT `cpp_logs_price_log_id_foreign` FOREIGN KEY (`price_log_id`) REFERENCES `price_logs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `location_product` ADD CONSTRAINT `location_product_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `location_product` ADD CONSTRAINT `location_product_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
