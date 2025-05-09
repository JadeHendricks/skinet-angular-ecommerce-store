using Core.Entities;
using Core.Interface;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController(IProductRepository repo) : ControllerBase
    {
        // api/products
        // this will return a list of products from the database
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(string? brand, string? type, string? sort)
        {
            return Ok(await repo.GetProductsAsync(brand, type, sort));
        }


        // api/products/1
        // this will return a single product from the database
        [HttpGet("{id:int}")] //api/products/1
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await repo.GetProductById(id);

            if (product == null) return NotFound();

            return product;
        }

        // api/products
        // this will create a new product in the database
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            repo.AddProduct(product);
            
            if (await repo.SaveChangesAsync())
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
            repo.UpdateProduct(product);

            if (await repo.SaveChangesAsync())
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
            var product = await repo.GetProductById(id);

            if (product == null) return NotFound();

            //updating the database
            // this will not delete the product from the database, it will just mark it as deleted
            repo.DeleteProduct(product);
            if (await repo.SaveChangesAsync())
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
            return Ok(await repo.GetBrandsAsync());
        }

        // api/products/types
        // this will return a list of product types
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetProductTypes()
        {
            return Ok(await repo.GetTypesAsync());
        }

        private bool ProductExists(int id)
        {
            return repo.ProductExists(id);
        }   
    }
}