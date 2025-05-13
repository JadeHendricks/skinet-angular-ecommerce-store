using Core.Entities;
using Core.Interface;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<T> where T : BaseEntity
    {
        public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> specification)
        {
            if (specification.Criteria != null)
            {
                // specification.Criteria would look something like x => x.Id == 1
                // where x is of type T
                query = query.Where(specification.Criteria);
            }

            if (specification.OrderBy != null)
            {
                query = query.OrderBy(specification.OrderBy);
            }

            if (specification.OrderByDescending != null)
            {
                query = query.OrderByDescending(specification.OrderByDescending);
            }


            if (specification.isDistinct)
            {
                query = query.Distinct();
            }

            return query;
        }

        public static IQueryable<TResult> GetQuery<TSpec, TResult>(IQueryable<T> query, ISpecification<T, TResult> specification)
        {
            if (specification.Criteria != null)
            {
                // specification.Criteria would look something like x => x.Id == 1
                // where x is of type T
                query = query.Where(specification.Criteria);
            }

            if (specification.OrderBy != null)
            {
                query = query.OrderBy(specification.OrderBy);
            }

            if (specification.OrderByDescending != null)
            {
                query = query.OrderByDescending(specification.OrderByDescending);
            }

            var selectQuery = query as IQueryable<TResult>;
            if (specification.Select != null)
            {
                selectQuery = query.Select(specification.Select);
            }

            if (specification.isDistinct)
            {
                selectQuery = selectQuery?.Distinct();
            }

            // cast here is used to convert the IQueryable<T> to IQueryable<TResult>
            // this is needed because we are using a generic type
            return selectQuery ?? query.Cast<TResult>();
        }
    }
}
