import { supabase } from "./supabaseClient";

export const scanRegister = async ({
  cliente,
  producto_id,
  descripcion = "",
  rubro = "",
  user_agent = "",
  ip = "",
}) => {
  try {
    const { error } = await supabase.from("scans").insert([
      {
        cliente,
        producto_id,
        descripcion,
        rubro,
        user_agent,
        ip,
      },
    ]);

    if (error) {
      console.error("❌ Error al registrar escaneo:", error.message);
    } else {
      console.log("✅ Escaneo registrado en Supabase");
    }
  } catch (err) {
    console.error("❌ Error inesperado:", err.message);
  }
};
