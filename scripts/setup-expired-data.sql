-- ============================================
-- Script: Setup de Datos VENCIDOS para testing
-- ============================================
-- Propósito: Crear préstamos y multas VENCIDOS pero con estado ACTIVE/PENDING
-- para que el cron job los detecte y:
--   1. Cambie préstamos a EXPIRED y cree multas automáticas
--   2. Cambie multas a EXPIRED y cree multas por pago atrasado
--   3. Cree notificaciones correspondientes
-- ============================================

-- Limpiar datos existentes
DELETE FROM notifications WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734';
DELETE FROM penalties WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734';
DELETE FROM loans WHERE user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734';

-- ============================================
-- PRÉSTAMOS VENCIDOS (estado ACTIVE)
-- ============================================

-- Préstamo 1: Vencido hace 5 días
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'ACTIVE',
    (NOW() - INTERVAL '12 days')::text,
    (NOW() - INTERVAL '5 days')::text
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 0;

-- Préstamo 2: Vencido hace 10 días
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'ACTIVE',
    (NOW() - INTERVAL '17 days')::text,
    (NOW() - INTERVAL '10 days')::text
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 1;

-- Préstamo 3: Vencido hace 1 día
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'ACTIVE',
    (NOW() - INTERVAL '8 days')::text,
    (NOW() - INTERVAL '1 day')::text
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 2;

-- ============================================
-- PRÉSTAMOS PARA LAS MULTAS (estado FINISHED)
-- ============================================

-- Préstamo 4: Finalizado (para multa 1)
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'FINISHED',
    (NOW() - INTERVAL '20 days')::text,
    (NOW() - INTERVAL '13 days')::text
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 3;

-- Préstamo 5: Finalizado (para multa 2)
INSERT INTO loans (book_id, user_id, status, created_at, end_date)
SELECT 
    id,
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    'FINISHED',
    (NOW() - INTERVAL '25 days')::text,
    (NOW() - INTERVAL '18 days')::text
FROM books 
WHERE book_status = 'AVAILABLE' 
LIMIT 1 OFFSET 4;

-- ============================================
-- MULTAS VENCIDAS (estado PENDING)
-- ============================================

-- Multa 1: Vencida hace 3 días (asociada al préstamo 4)
INSERT INTO penalties (user_id, loan_id, sanction_id, status, created_at, expires_in)
SELECT 
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    l.id,
    s.id,
    'PENDING',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '3 days'
FROM sanctions s, loans l
WHERE s.type = 'DEVOLUCION_TARDIA'
AND l.user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734'
AND l.status = 'FINISHED'
ORDER BY l.created_at::timestamp
LIMIT 1 OFFSET 0;

-- Multa 2: Vencida hace 7 días (asociada al préstamo 5)
INSERT INTO penalties (user_id, loan_id, sanction_id, status, created_at, expires_in)
SELECT 
    '92ea696c-6d69-4b4d-a6fa-d61b4dda4734',
    l.id,
    s.id,
    'PENDING',
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '7 days'
FROM sanctions s, loans l
WHERE s.type = 'DEVOLUCION_TARDIA'
AND l.user_id = '92ea696c-6d69-4b4d-a6fa-d61b4dda4734'
AND l.status = 'FINISHED'
ORDER BY l.created_at::timestamp
LIMIT 1 OFFSET 1;

-- Verificar lo creado
SELECT 
    'Préstamos VENCIDOS (ACTIVE)' as tipo,
    COUNT(*) as cantidad,
    STRING_AGG(DISTINCT status::text, ', ') as estados
FROM loans
WHERE status = 'ACTIVE' AND end_date::timestamp < NOW()

UNION ALL

SELECT 
    'Multas VENCIDAS (PENDING)' as tipo,
    COUNT(*) as cantidad,
    STRING_AGG(DISTINCT status::text, ', ') as estados
FROM penalties
WHERE status = 'PENDING' AND expires_in < NOW();

-- Mostrar detalles
SELECT 
    'PRÉSTAMO' as tipo,
    id,
    status,
    end_date as fecha_vencimiento,
    EXTRACT(DAY FROM (NOW() - end_date::timestamp)) as dias_vencido
FROM loans
ORDER BY end_date;

SELECT 
    'MULTA' as tipo,
    id,
    status,
    expires_in as fecha_vencimiento,
    EXTRACT(DAY FROM (NOW() - expires_in)) as dias_vencido
FROM penalties
ORDER BY expires_in;

-- ============================================
-- RESULTADO ESPERADO AL EJECUTAR CRON JOB:
-- ============================================
-- ✅ 3 préstamos cambiarán a estado EXPIRED
-- ✅ 3 multas nuevas por DEVOLUCION_TARDIA
-- ✅ 3 notificaciones PENALTY_APPLIED
-- ✅ 2 multas cambiarán a estado EXPIRED
-- ✅ 2 multas nuevas por PAGO_ATRASADO
-- ✅ 2 notificaciones PENALTY_EXPIRED
-- TOTAL: 5 multas nuevas, 5 notificaciones
-- ============================================
