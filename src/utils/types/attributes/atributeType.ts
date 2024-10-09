export interface AttributeResponse {
  id: string; // Identificador único del atributo
  name: string; // Nombre del atributo
  unitDefault?: string; // Unidad por defecto (opcional)
  createdAt: Date; // Fecha de creación
  updatedAt: Date;
  productCount?: number; // Fecha de actualización
}
