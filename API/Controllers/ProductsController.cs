using Core.Entities;
using Core.Interface;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
    {
        // api/products
        // this will return a list of products from the database
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(string? brand, string? type, string? sort)
        {
            var specification = new ProductSpecification(brand, type, sort);
            // this will return a list of products from the database
            // the specification will be used to filter the products based on the brand and type
            var products = await repo.ListAsync(specification);

            return Ok(products);
        }


        // api/products/1
        // this will return a single product from the database
        [HttpGet("{id:int}")] //api/products/1
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await repo.GetByIdAsync(id);

            if (product == null) return NotFound();

            return product;
        }

        // api/products
        // this will create a new product in the database
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            repo.Add(product);
            
            if (await repo.SaveAllAsync())
            {
                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }

            return BadRequest("Problem creating product");
        }

        // api/products/1
        // this will update the product in the database
        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateProduct(int id, Product product)
        {
            if (product.Id != id || !ProductExists(id)) return BadRequest("Cannot update this product");

            // letting entity framework know that the product has been modified
            repo.Update(product);

            if (await repo.SaveAllAsync())
            {
                return NoContent();
            }
            // if the product was not updated, return a bad request
            return BadRequest();
        }

        // api/products/1
        // this will delete the product from the database
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await repo.GetByIdAsync(id);

            if (product == null) return NotFound();

            //updating the database
            // this will not delete the product from the database, it will just mark it as deleted
            repo.Remove(product);
            if (await repo.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Problem deleting the product");
        }

        // api/products/brands
        // this will return a list of product brands
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetProductBrands()
        {
            var spec = new BrandListSpecification();
            return Ok(await repo.ListAsync(spec));
        }

        // api/products/types
        // this will return a list of product types
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetProductTypes()
        {
            var spec = new TypeListSpecification();
            return Ok(await repo.ListAsync(spec));
        }

        private bool ProductExists(int id)
        {
            return repo.Exists(id);
        }   
    }
}