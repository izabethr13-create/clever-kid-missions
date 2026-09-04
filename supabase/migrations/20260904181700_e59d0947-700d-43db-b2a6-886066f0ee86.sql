CREATE TABLE public.progreso_nube (
  code TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.progreso_nube TO anon;
GRANT SELECT, INSERT, UPDATE ON public.progreso_nube TO authenticated;
GRANT ALL ON public.progreso_nube TO service_role;

ALTER TABLE public.progreso_nube ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera con el codigo puede leer" ON public.progreso_nube FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Cualquiera puede crear su guardado" ON public.progreso_nube FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Cualquiera con el codigo puede actualizar" ON public.progreso_nube FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);