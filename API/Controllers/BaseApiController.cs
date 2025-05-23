using API.RequestHelpers;
using Core.Entities;
using Core.Interface;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // this automatically adds validation error to the modelstate dictionary
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        // this is the base controller that all other controllers will inherit from
        // this will be used to handle the common functionality for all controllers
        // for example, we can use this to handle the errors and logging
        // and we can also use this to handle the authentication and authorization
        protected async Task<ActionResult> CreatePageResult<T>(IGenericRepository<T> repository, ISpecification<T> spec, int pageIndex, int pageSize) where T : BaseEntity
        {
            var count = await repository.CountAsync(spec);
            var items = await repository.ListAsync(spec);

            var pagination = new Pagination<T>(pageIndex, pageSize, count, items);

            return Ok(pagination);
        }

    }
}