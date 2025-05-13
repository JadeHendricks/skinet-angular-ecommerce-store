using Core.Entities;

namespace Core.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    // when we say "base" here we are referring to the constructor of the base class
    // and we are passing the criteria to the base class constructor i.e BaseSpecification
    // this is a constructor chaining
    public ProductSpecification(string? brand, string? type, string? sort) : base(x =>
        (string.IsNullOrEmpty(brand) || x.Brand == brand) &&
        (string.IsNullOrEmpty(type) || x.Type == type))
    {
        switch (sort)
        {
            case "priceAsc":
                AddOrderBy(p => p.Price);
                break;
            case "priceDesc":
                AddOrderByDescending(p => p.Price);
                break;
            default:
                AddOrderBy(p => p.Name);
                break;
        }
    }
}