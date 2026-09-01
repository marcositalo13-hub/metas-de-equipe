-- Permite múltiplas marcações do mesmo tipo (M ou S) por pessoa por dia.
-- O nome da constraint vem diretamente do schema.sql original.
alter table metas drop constraint if exists metas_pessoa_tipo_data_key;
