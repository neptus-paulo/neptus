import DeviceConfigForm from "@/components/forms/DeviceForm";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Configurations = () => {
  return (
    <main className="space-y-5">
      <PageHeader
        title="Configurações"
        description="Mantenha os dados atualizados"
      />

      <Tabs defaultValue="dispositivo" className="space-y-5">
        <TabsList className="flex w-full p-0">
          <TabsTrigger value="dispositivo">Dispositivo</TabsTrigger>
          <TabsTrigger value="conta">Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="dispositivo">
          <DeviceConfigForm />
        </TabsContent>
        <TabsContent value="conta">
          <DeviceConfigForm />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Configurations;
