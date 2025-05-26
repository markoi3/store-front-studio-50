const Storefront = () => {
  // ... hookovi

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-muted rounded mb-4"></div>
            <div className="h-4 w-60 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Prodavnica nije dostupna</h1>
            <p className="text-muted-foreground mb-6">
              {error || "Prodavnica koju tražite ne postoji ili više nije dostupna."}
            </p>
            <Button asChild>
              <a href="/">Povratak na početnu</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayProducts = storeProducts.length > 0 ? storeProducts : getDefaultProducts(storeId);

  const handleNavigate = (path: string) => {
    if (path.startsWith('/')) {
      const fullPath = `/store/${storeId}${path}`;
      navigate(fullPath);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="space-y-12">
      <PageElementRenderer 
        elements={store.elements}
        products={displayProducts}
        storeId={storeId || ''}
        onNavigate={handleNavigate}
      />
      {store?.settings.privacyPolicy && (
        <div className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Politika privatnosti</h2>
            <div className="prose">{store.settings.privacyPolicy}</div>
          </div>
        </div>
      )}
    </div>
  );
};
