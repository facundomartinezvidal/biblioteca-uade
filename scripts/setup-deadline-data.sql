-- ============================================
-- Script: Setup de Datos PRÓXIMOS A VENCER para testing
-- ============================================
-- Propósito: Crear SOLO préstamos próximos a vencer (dentro de 24h)
-- para que el cron job los detecte y cree notificaciones LOAN_DEADLINE
-- ============================================

-- Limpiar datos existentes
DELETE FROM notifications WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734';
DELETE FROM penalties WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734';
DELETE FROM loans WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734';

-- ============================================
-- PRÉSTAMOS PRÓXIMOS A VENCER (dentro de 24h)
-- ============================================

-- Préstamo 1: Vence en 23 horas
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'ACTIVE',
    (NOW() - INTERVAL '6 days')::text,
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 0;

-- Préstamo 2: Vence en 12 horas
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'ACTIVE',
    (NOW() - INTERVAL '6 days 12 hours')::text,
    (NOW() + INTERVAL '12 hours')::text
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 1;

-- Préstamo 3: Vence en 5 horas
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'ACTIVE',
    (NOW() - INTERVAL '6 days 19 hours')::text,
    (NOW() + INTERVAL '5 hours')::text
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 2;

-- Verificar lo creado
SELECT 
    'Préstamos próximos a vencer (<24h)' as tipo,
    COUNT(*) as cantidad,
    STRING_AGG(DISTINCT status::text, ', ') as estados
FROM loans
WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734'
  AND status = 'ACTIVE' 
  AND end_date::timestamp > NOW() 
  AND end_date::timestamp < (NOW() + INTERVAL '24 hours');

-- Mostrar detalles con tiempo restante
SELECT 
    'PRÉSTAMO' as tipo,
    id,
    status,
    end_date as fecha_vencimiento,
    EXTRACT(HOUR FROM (end_date::timestamp - NOW())) as horas_restantes,
    ROUND(EXTRACT(EPOCH FROM (end_date::timestamp - NOW())) / 60) as minutos_restantes
FROM loans
WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734'
  AND status = 'ACTIVE'
ORDER BY end_date;

-- ============================================
-- RESULTADO ESPERADO AL EJECUTAR CRON JOB:
-- ============================================
-- ✅ 3 notificaciones LOAN_DEADLINE creadas
-- ✅ Los estados NO cambian (siguen ACTIVE)
-- ✅ NO se crean multas
-- ✅ NO se cambian estados
-- TOTAL: 3 notificaciones de tipo LOAN_DEADLINE
-- ============================================
